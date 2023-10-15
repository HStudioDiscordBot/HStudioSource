const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, getVoiceConnection, AudioPlayer, createAudioPlayer } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Pause the currently playing track'),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    const player = new createAudioPlayer();

    connection.subscribe(player);
    if (player.unpause()) {
        await interaction.reply("Resumed");
    }
  },
};
