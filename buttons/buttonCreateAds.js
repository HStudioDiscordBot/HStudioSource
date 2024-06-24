const { ButtonInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const Locale = require("../class/Locale");

module.exports = {
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        const createModal = new ModalBuilder()
            .setCustomId("create_ads")
            .setTitle(locale.getLocaleString("command.ads.create.modal.title"));

        const createModalDescription = new TextInputBuilder()
            .setCustomId("description")
            .setLabel(locale.getLocaleString("command.ads.create.modal.description"))
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const createModalImageUrl = new TextInputBuilder()
            .setCustomId("imageUrl")
            .setLabel(locale.getLocaleString("command.ads.create.modal.imageUrl"))
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const createModalButtonText = new TextInputBuilder()
            .setCustomId("buttonText")
            .setLabel(locale.getLocaleString("command.ads.create.modal.button.text"))
            .setPlaceholder(locale.getLocaleString("command.ads.create.modal.button.text.placeholder"))
            .setValue(locale.getLocaleString("command.ads.create.modal.button.text.value"))
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(50);

        const createModalButtonUrl = new TextInputBuilder()
            .setCustomId("buttonUrl")
            .setLabel(locale.getLocaleString("command.ads.create.modal.button.url"))
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const createModalVoucherUrl = new TextInputBuilder()
            .setCustomId("voucherUrl")
            .setRequired(true)
            .setPlaceholder("https://gift.truemoney.com/campaign/?v=xxxxx")
            .setLabel(locale.getLocaleString("command.ads.create.modal.voucher.url"))
            .setStyle(TextInputStyle.Short);

        const createDescriptionAction = new ActionRowBuilder().addComponents(createModalDescription);
        const createImageUrlAction = new ActionRowBuilder().addComponents(createModalImageUrl);
        const createButtonTextAction = new ActionRowBuilder().addComponents(createModalButtonText);
        const createButtonUrlAction = new ActionRowBuilder().addComponents(createModalButtonUrl);
        const createVoucherUrlAction = new ActionRowBuilder().addComponents(createModalVoucherUrl);

        createModal.addComponents(createDescriptionAction, createImageUrlAction, createButtonTextAction, createButtonUrlAction, createVoucherUrlAction);

        await interaction.showModal(createModal);
    }
}