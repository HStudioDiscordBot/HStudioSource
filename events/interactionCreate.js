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
            }
        }
    }
}