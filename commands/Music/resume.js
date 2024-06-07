const { CommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume Current Track")
        .setDescriptionLocalizations({
            th: "เล่นเพลงต่อ",
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
                        .setDescription(locale.getLocaleString("command.resume.notinvoicechannel"))
                ]
            });
        }

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