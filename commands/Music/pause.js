const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, getVoiceConnection, AudioPlayer } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the currently playing track'),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    const player = new AudioPlayer();

    console.log(connection.state.status);
    player.pause();
    await interaction.reply("Paused");
  },
};
