const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription(lang.default.commands.report.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.report.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const modal = new ModalBuilder()
            .setTitle(requestedLocalization.commands.report.modals.ModalTitle)
            .setCustomId('bugreport');

        const command = new TextInputBuilder()
            .setCustomId('command')
            .setRequired(true)
            .setPlaceholder(requestedLocalization.commands.report.modals.ModalCommandPlaceholder)
            .setLabel(requestedLocalization.commands.report.modals.ModalCommandLabel)
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setRequired(true)
            .setPlaceholder(requestedLocalization.commands.report.modals.ModalDescriptionPlaceHolder)
            .setLabel(requestedLocalization.commands.report.modals.ModalDescriptionLabel)
            .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(command);
        const two = new ActionRowBuilder().addComponents(description);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    }
}