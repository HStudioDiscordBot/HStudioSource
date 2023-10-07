const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(lang.default.commands.config.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.config.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        await interaction.reply({ embeds: [ new EmbedBuilder().setTitle(`${interaction.commandName}`).setColor(config.color)]});
    },
};
