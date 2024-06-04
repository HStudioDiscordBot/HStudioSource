const lang = require('../../lang.json');
const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription(lang.default.commands.pause.description)
    .setDescriptionLocalizations({
      th: lang.th.commands.pause.description,
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

    if (player.pause()) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription("⏸️ หยุดเพลงชั่วคราว")
        ]
      });
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription("⏸️ หยุดเพลงชั่วคราวอยู่แล้ว")
        ]
      });
    }
  },
};
