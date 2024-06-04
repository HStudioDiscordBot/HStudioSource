const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js')

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(lang.default.commands.leave.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.leave.description,
        }),
    async execute(interaction, client) {
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
                        .setDescription("⚠️ บอทยังไม่ได้เข้าห้องเสียง")
                ]
            });
        }

        if (player.destroy()) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("🔴 ออกจากห้องเสียงแล้ว")
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("🔴 ไม่สามารถออกจากห้องเสียงได้")
                ]
            });
        }
    },
};
