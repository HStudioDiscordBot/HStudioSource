const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip this track")
        .setDescriptionLocalizations({
            th: "ข้ามเพลงนี้"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle(locale.getLocaleString("command.join.userNotInVoiceChannel"))] });

        await interaction.deferReply();

        let player = client.moon.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoLeave: true,
            autoPlay: true
        });

        if (!player.connected) {
            player.destroy();
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.skip.botNotInVoiceChannel"))
                ]
            });
        }

        if (!player.playing) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(locale.getLocaleString("command.skip.fail"))
                    .setColor(Colors.Yellow)
            ],
            ephemeral: true
        });

        const queue = player.queue.tracks;

        if (queue.length == 0) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setTitle(locale.getLocaleString("command.queue.noqueue"))
            ]
        });

        if (player.skip()) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.getLocaleString("command.skip.success"))
                ]
            });
        } else {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.skip.fail"))
                ]
            });
        }
    }
};