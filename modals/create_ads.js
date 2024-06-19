const { ModalSubmitInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
const Locale = require("../class/Locale");
const twApi = require("@opecgame/twapi");
const AdSchema = require("../schemas/Ad");
const adsConfig = require("../configs/ads.json");

module.exports = {
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
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

        // Debug
        tw.status.code = "SUCCESS",
            tw.data = {
                my_ticket: {
                    amount_baht: 5
                }
            };

        switch (tw.status.code) {
            case "SUCCESS":
                const age = parseFloat(tw.data.my_ticket.amount_baht) / adsConfig.rate.amount;

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
}