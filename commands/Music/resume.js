const lang = require('../../lang.json');
const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription(lang.default.commands.resume.description)
    .setDescriptionLocalizations({
      th: lang.th.commands.resume.description,
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

    if (player.resume()) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription("▶️ เล่นเพลงต่อ")
        ]
      });
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription("▶️ เพลงกำลังเล่นอยู่")
        ]
      });
    }
  },
};
