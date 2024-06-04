const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription(lang.default.commands.volume.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.volume.description,
        })
        .addStringOption(option =>
            option.setName('level')
                .setDescription(lang.default.commands.volume.StringOption.level.description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands.volume.StringOption.level.description,
                })),
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

        const level = interaction.options.getString('level');

        if (isNaN(level)) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`:warning: ${level} ไม่ใช่ตัวเลข`)
                    .setColor(Colors.Blue)
                ],
                ephemeral: true
            });
        }

        const levelInt = parseInt(level);

        if (levelInt <= 0 || levelInt > 150) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`:warning: ระดับเสียงควรอยู่ระหว่าง 1 ถึง 100`)
                    .setColor(Colors.Blue)
                ],
                ephemeral: true
            });
        }

        if (player.setVolume(levelInt)) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`🔊 กำหนดระดับเสียงเป็น **${levelInt}** แล้ว`)
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ ไม่สามารถกำหนดระดับเสียงได้")
                ]
            });
        }
    },
};
