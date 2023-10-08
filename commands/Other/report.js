const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription(lang.default.commands.report.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.report.description,
        }),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setTitle(`Bug & Command Abuse Reporting`)
            .setCustomId('bugreport');

        const command = new TextInputBuilder()
            .setCustomId('command')
            .setRequired(true)
            .setPlaceholder('Plase only state the command name')
            .setLabel('What command has bug or has been abused')
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setRequired(true)
            .setPlaceholder('Be sure to be as detailed as possible so the developers can take action')
            .setLabel('Descibe the bug of command abuse')
            .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(command);
        const two = new ActionRowBuilder().addComponents(description);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    }
}