const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js')

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription(lang.default.commands.join.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.join.description,
        }),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning: คุณต้องอยู่ใน Voice Channel ก่อนเชิญบอท`).setColor(Colors.Yellow)] });

        let player = client.moon.players.create({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            autoLeave: true
        });

        if (!player.connected) {
            if (player.connect({setDeaf: true, setMute: false})) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription("🟢 เข้าห้องเสียงแล้ว")
                    ]
                });
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription("🔴 ไม่สามารถเข้าห้องเสียงได้")
                    ]
                });
            }
        }
    },
};
