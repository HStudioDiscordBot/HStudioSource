const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(lang.default.commands.loop.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.loop.description,
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

        if (player.loop == 0) {
            player.setLoop(1);
            if (player.loop == 1) interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription("🔁 เปิดเล่นซ้ำแล้ว")
                ]
            });
            else interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ ไม่สามารถเปิดเล่นซ้ำได้")
                ]
            });
        } else if (player.loop == 1) {
            player.setLoop(0);
            if (player.loop == 0) interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription("🔁 ปิดเล่นซ้ำแล้ว")
                ]
            });
            else interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ ไม่สามารถปิดเล่นซ้ำได้")
                ]
            });
        }
    },
};
