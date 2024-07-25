const { SlashCommandBuilder, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Queue")
        .setDescriptionLocalizations({
            th: "ดูคิวเพลง"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle(locale.getLocaleString("command.join.userNotInVoiceChannel"))] });

        let player = client.moon.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoLeave: true,
            autoPlay: true
        });

        if (!player.connected) {
            player.destroy();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.skip.botNotInVoiceChannel"))
                ]
            });
        }

        const queue = player.queue.tracks;

        if (queue.length == 0) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setTitle(locale.getLocaleString("command.queue.noqueue"))
            ]
        });

        // Pagination variables
        const itemsPerPage = 10;
        let currentPage = 0;
        const totalPages = Math.ceil(queue.length / itemsPerPage);

        const generateQueueEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const queuePage = queue.slice(start, end);

            const queueDescription = queuePage.map((track, index) => {
                const trackIndex = start + index + 1;
                if (track.sourceName == "spotify") {
                    return locale.replacePlaceholders(locale.getLocaleString("command.queue.spotify.raw"), [trackIndex, track.title, track.url, track.author]);
                } else {
                    console.log(track);
                    return locale.replacePlaceholders(locale.getLocaleString("command.queue.raw"), [trackIndex, track.title, track.author]);
                }
            }).join("\n");

            return new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale.getLocaleString("command.queue.title"))
                .setDescription(queueDescription)
                .setFooter({ text: locale.replacePlaceholders(locale.getLocaleString("command.queue.totalTracks"), [queue.length]) });
        };

        const getActionRow = (page) => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("previous")
                        .setLabel("◀️")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId("totalPages")
                        .setLabel(`${currentPage}/${totalPages}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId("next")
                        .setLabel("▶️")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages - 1)
                );
        };

        const message = await interaction.reply({
            embeds: [generateQueueEmbed(currentPage)],
            components: [getActionRow(currentPage)],
            fetchReply: true
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60_000 });

        collector.on("collect", async i => {
            if (i.customId === "previous") {
                currentPage--;
            } else if (i.customId === "next") {
                currentPage++;
            }

            await i.update({
                embeds: [generateQueueEmbed(currentPage)],
                components: [getActionRow(currentPage)]
            });
        });

        collector.on("end", () => {
            message.edit({
                components: []
            });
        });
    }
};
