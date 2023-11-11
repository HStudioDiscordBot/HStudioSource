const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription(lang.default.commands.donate.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.donate.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const modal = new ModalBuilder()
            .setTitle(requestedLocalization.commands.donate.modals.ModalTitle)
            .setCustomId('donate');

        const url = new TextInputBuilder()
            .setCustomId('url')
            .setRequired(true)
            .setPlaceholder(requestedLocalization.commands.donate.modals.ModalUrlPlaceholder)
            .setLabel(requestedLocalization.commands.donate.modals.ModalUrlLabel)
            .setStyle(TextInputStyle.Short);

        const one = new ActionRowBuilder().addComponents(url);

        modal.addComponents(one);
        await interaction.showModal(modal);
    }
}