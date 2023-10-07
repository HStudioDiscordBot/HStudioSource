const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice');

const lang = require('../../lang.json');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(lang.default.commands.leave.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.leave.description,
        }),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (connection) {
            connection.destroy();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.color).setTitle(`🔴 ${requestedLocalization.commands.leave.execute.success}`)] });
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.color).setTitle(`🔴 ${requestedLocalization.commands.leave.execute.not_in_voice_channel}`)] });
        }
        
    },
};
