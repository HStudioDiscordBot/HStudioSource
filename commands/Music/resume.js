const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume Current Track")
        .setDescriptionLocalizations({
            th: "เล่นเพลงต่อ",
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
                        .setDescription(locale.getLocaleString("command.resume.notinvoicechannel"))
                ]
            });
        }

        if (!player.playing) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(locale.getLocaleString("command.resume.fail"))
                    .setColor(Colors.Yellow)
            ],
            ephemeral: true
        });

        if (player.resume()) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(locale.getLocaleString("command.resume.resumed"))
                ]
            });
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(locale.getLocaleString("command.resume.alreadyResumed"))
                ]
            });
        }
    },
};