const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave from Voice Channel")
        .setDescriptionLocalizations({
            th: "ออกจากห้องเสียง"
        }),

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
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
                        .setDescription(locale.getLocaleString("command.leave.botNotInVoiceChannel"))
                ]
            });
        }

        if (player.destroy()) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.leave.leaved"))
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.leave.fail"))
                ]
            });
        }
    }
}