const { ButtonInteraction, Client, EmbedBuilder, Colors, WebhookClient } = require("discord.js");
const Locale = require("../class/Locale");
const AdSchema = require("../schemas/Ad");

module.exports = {
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        const message = interaction.message;

        const embed = new EmbedBuilder(message.embeds[0]);

        const adsId = embed.data.footer.text;

        if (!adsId) return await interaction.editReply({
            content: locale.getLocaleString("button.ads.confirm.unknow_id"),
            ephemeral: true
        });

        await interaction.deferReply({ ephemeral: true });

        try {
            const adsData = await AdSchema.findById(adsId);

            if (!adsData) return await interaction.editReply({
                content: locale.getLocaleString("button.ads.confirm.unknow_ad"),
                ephemeral: true
            });

            await AdSchema.findByIdAndUpdate(adsId, {
                verify: true
            });

            const adsOwner = await client.users.fetch(adsData.owner);

            try {
                if (adsOwner) {
                    await adsOwner.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription(locale.replacePlaceholders("button.ads.confirm.message.owner.send", [adsData._id]))
                        ]
                    });
                }

                await interaction.editReply({
                    content: locale.replacePlaceholders(locale.getLocaleString("button.ads.confirm.reply.success"), [adsData._id]),
                    ephemeral: true
                });

                embed
                    .setColor(Colors.Green)
                    .addFields({
                        name: "Activated at",
                        value: new Date().toLocaleDateString()
                    });

                await message.edit({
                    embeds: [embed],
                    components: []
                });

                try {
                    const verifiedChannel = await client.channels.fetch(process.env.VERIFIED_CHANNEL_ID);

                    if (verifiedChannel) {
                        await verifiedChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Colors.Green)
                                    .setDescription(locale.replacePlaceholders(locale.getLocaleString("button.ads.confirm.verified.channel.success"), [adsData._id]))
                            ]
                        });
                    }
                } catch (err) {
                    const errorWebhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });

                    await errorWebhook.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(`\`\`\`${err}\`\`\``)
                        ]
                    });
                }
            } catch (err) {
                await interaction.editReply({
                    content: locale.replacePlaceholders(locale.getLocaleString("button.ads.confirm.message.owner.notsend"), [adsData._id]),
                    ephemeral: true
                });
            }
        } catch (err) {
            await interaction.editReply({
                content: locale.getLocaleString("button.ads.confirm.error.message"),
                ephemeral: true
            });

            const errorWebhook = new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL });

            await errorWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`\`\`\`${err}\`\`\``)
                ]
            });
        }
    }
}