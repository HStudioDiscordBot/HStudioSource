const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join Voice Channel")
        .setDescriptionLocalizations({
            th: "เข้าห้องเสียง"
        }),

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
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
            if (player.connect({ setDeaf: true, setMute: false })) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(locale.getLocaleString("command.join.joined"))
                    ]
                });
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(locale.getLocaleString("command.join.fail"))
                    ]
                });
            }
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.getLocaleString("command.join.joined"))
                ]
            });
        }
    }
}