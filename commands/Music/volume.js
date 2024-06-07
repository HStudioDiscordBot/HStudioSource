const { SlashCommandBuilder, CommandInteraction, Client, Colors, EmbedBuilder } = require("discord.js");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change Volume")
        .setDescriptionLocalizations({
            th: "ปรับระดับเสียง"
        })
        .addIntegerOption(option => option
            .setName("level")
            .setDescription("Volume Level")
            .setDescriptionLocalizations({
                th: "ระดับเสียง"
            })
            .setRequired(true)
        ),
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
                        .setDescription(locale.getLocaleString("command.volume.botNotInVoiceChannel"))
                ]
            });
        }

        const level = interaction.options.getInteger("level");

        if (level <= 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(locale.getLocaleString("command.volume.level.more_0"))
                        .setColor(Colors.Blue)
                ],
                ephemeral: true
            });
        } else if (level > 200) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(locale.getLocaleString("command.volume.level.less_200"))
                        .setColor(Colors.Blue)
                ],
                ephemeral: true
            });
        }

        if (player.setVolume(level)) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.volume.success"), [level]))
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.volume.fail"))
                ]
            });
        }
    }
}