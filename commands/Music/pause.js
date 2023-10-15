const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, getVoiceConnection, AudioPlayer, createAudioPlayer } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the currently playing track'),
  async execute(interaction, client) {
    const connection = getVoiceConnection(interaction.guild.id);
    const player = new createAudioPlayer();


    const isPause = await player.pause();
    connection.subscribe(player);

    console.log(isPause);

    if (isPause) {
      await interaction.reply("Paused");
    }

    player.on(AudioPlayerStatus.Paused, (oldState, newState) => {
      console.log('Paused');
    });
  },
};
