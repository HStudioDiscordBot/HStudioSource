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

        let player = client.moon.players.create({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            autoLeave: true
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

        if (player.skip()) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.getLocaleString("command.skip.success"))
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.skip.fail"))
                ]
            });
        }
    }
};