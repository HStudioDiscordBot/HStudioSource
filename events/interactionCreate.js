const { Events, Client, Interaction, Colors, EmbedBuilder, WebhookClient } = require("discord.js");
const twApi = require('@opecgame/twapi');
const Locale = require("../class/Locale");

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
                if (!interaction.deferred) {
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
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Blue).setDescription(locale.getLocaleString("modal.submit.donate.reply"))], ephemeral: true });

                const url = interaction.fields.getTextInputValue('url');
                const voucher_code = url.replace('https://gift.truemoney.com/campaign/?v=', '');

                const tw = await twApi(voucher_code, process.env.TRUEMONEY_PHONE_NUMBER);

                switch (tw.status.code) {
                    case "SUCCESS":
                        const webhook = new WebhookClient({ url: process.env.DONATE_WEBHOOK_URL });
                        await webhook.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Colors.Yellow)
                                    .setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.donate.success"), [tw.data.owner_profile.full_name, tw.data.my_ticket.amount_baht]))
                            ]
                        });

                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Green).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.donate.reply.success"), [tw.data.my_ticket.amount_baht]))] });
                        break;
                    case "CANNOT_GET_OWN_VOUCHER":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.CANNOT_GET_OWN_VOUCHER"))] });
                        break;
                    case "TARGET_USER_NOT_FOUND":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.TARGET_USER_NOT_FOUND"))] });
                        break;
                    case "INTERNAL_ERROR":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.INTERNAL_ERROR"))] });
                        break;
                    case "VOUCHER_OUT_OF_STOCK":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_OUT_OF_STOCK"))] });
                        break;
                    case "VOUCHER_NOT_FOUND":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_NOT_FOUND"))] });
                        break;
                    case "VOUCHER_EXPIRED":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_EXPIRED"))] });
                        break;
                    default:
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.default"))] });
                        break;
                }
            } else if (customId == "create_ads") {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Blue).setDescription(locale.getLocaleString("modal.submit.ads.create.reply"))], ephemeral: true });

                const description = interaction.fields.getTextInputValue("description");
                const imageUrl = interaction.fields.getTextInputValue("imageUrl");
                const buttonText = interaction.fields.getTextInputValue("buttonText");
                const buttonUrl = interaction.fields.getTextInputValue("buttonUrl");
                const voucherUrl = interaction.fields.getTextInputValue("voucherUrl");

                if (!description) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.undifine.text"), ["description"]))] });
                if (!imageUrl) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.undifine.text"), ["imageUrl"]))] });
                if (!buttonText) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.undifine.text"), ["buttonText"]))] });
                if (!buttonUrl) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.undifine.text"), ["buttonUrl"]))] });
                if (!voucherUrl) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.undifine.text"), ["voucherUrl"]))] });

                const voucher_code = voucherUrl.replace('https://gift.truemoney.com/campaign/?v=', '');

                const tw = await twApi(voucher_code, process.env.TRUEMONEY_PHONE_NUMBER);

                tw.status.code = "SUCCESS",
                    tw.data = {
                        my_ticket: {
                            amount_baht: 5
                        }
                    };

                switch (tw.status.code) {
                    case "SUCCESS":
                        const age = parseFloat(tw.data.my_ticket.amount_baht) / adsConfig.rate.amount;

                        const expireAt = new Date(Date.now() + age * 24 * 60 * 60 * 1000 * adsConfig.rate.day);

                        const ad = await AdSchema.create({
                            owner: interaction.user.id,
                            description: description,
                            imageUrl: imageUrl,
                            buttonText: buttonText,
                            buttonUrl: buttonUrl,
                            age: age,
                            activate: false,
                            verify: false,
                        });

                        if (!ad) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.ads.create.undifine.text"))] });

                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Green).setTitle(locale.getLocaleString("modal.submit.ads.create.success")).setDescription(locale.replacePlaceholders(locale.getLocaleString("modal.submit.ads.create.success.description"), [ad._id]))] });
                        break;
                    case "CANNOT_GET_OWN_VOUCHER":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.CANNOT_GET_OWN_VOUCHER"))] });
                        break;
                    case "TARGET_USER_NOT_FOUND":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.TARGET_USER_NOT_FOUND"))] });
                        break;
                    case "INTERNAL_ERROR":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.INTERNAL_ERROR"))] });
                        break;
                    case "VOUCHER_OUT_OF_STOCK":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_OUT_OF_STOCK"))] });
                        break;
                    case "VOUCHER_NOT_FOUND":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_NOT_FOUND"))] });
                        break;
                    case "VOUCHER_EXPIRED":
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.VOUCHER_EXPIRED"))] });
                        break;
                    default:
                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(locale.getLocaleString("modal.submit.donate.reply.fail.default"))] });
                        break;
                }
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