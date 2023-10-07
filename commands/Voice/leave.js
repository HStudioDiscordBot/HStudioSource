const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(lang.default.commands_leave_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_leave_description,
        }),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (connection) {
            connection.destroy();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle(requestedLocalization.commands_leave_not_in_voice_channel)] });
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle(requestedLocalization.commands_leave_not_in_voice_channel)] });
        }
        
    },
};
