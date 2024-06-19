const { Events, Client, Interaction, Colors, EmbedBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder } = require("discord.js");
const Locale = require("../class/Locale");
const donateModal = require("../modals/donate");
const createAdsModal = require("../modals/create_ads");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const locale = new Locale(interaction.locale);

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client, locale);
            } catch (err) {
                console.log(err);
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setTitle(locale.getLocaleString("interaction.command.error"))
                                .setDescription(`\`\`\`${err}\`\`\``)
                        ],
                        ephemeral: true
                    });
                } else if (!interaction.replied) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setTitle(locale.getLocaleString("interaction.command.error"))
                                .setDescription(`\`\`\`${err}\`\`\``)
                        ],
                        ephemeral: true
                    });
                }
            }
        } else if (interaction.isModalSubmit()) {
            const customId = interaction.customId;

            if (customId == "donate") {
                donateModal.execute(interaction, client, locale);
            } else if (customId == "create_ads") {
                createAdsModal.execute(interaction, client, locale);
            }
        } else if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId == "buttonCreateAds") {
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
    }
}