const { EmbedBuilder, Colors, WebhookClient } = require("discord.js");
const AdSchema = require("../schemas/Ad");

module.exports = {
    /**
     * 
     * @param {import("discord.js").ButtonInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        const message = interaction.message;

        const embed = new EmbedBuilder(message.embeds[0]);

        const adsId = embed.data.footer.text;

        if (!adsId) return await interaction.editReply({
            content: locale.getLocaleString("button.ads.deny.unknown_id"),
            ephemeral: true
        });

        await interaction.deferReply({ ephemeral: true });

        try {
            const adsData = await AdSchema.findById(adsId);

            if (!adsData) return await interaction.editReply({
                content: locale.getLocaleString("button.ads.deny.unknown_ad"),
                ephemeral: false
            });

            await AdSchema.findByIdAndDelete(adsId);

            const adsOwner = await client.users.fetch(adsData.owner);

            try {
                if (adsOwner) {
                    await adsOwner.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(locale.replacePlaceholders(locale.getLocaleString("button.ads.deny.message.owner.send"), [adsData._id]))
                        ]
                    });
                }

                await interaction.editReply({
                    content: locale.replacePlaceholders(locale.getLocaleString("button.ads.deny.reply.success"), [adsData._id]),
                    ephemeral: true
                });

                embed.setColor(Colors.Red)

                await message.edit({
                    embeds: [embed],
                    components: []
                });
            } catch (err) {
                await interaction.editReply({
                    content: locale.replacePlaceholders(locale.getLocaleString("button.ads.deny.reply.owner.cant_send"), [adsData._id]),
                    ephemeral: true
                });
                
                console.error(err);
            }
        } catch (err) {
            await interaction.editReply({
                content: locale.getLocaleString("button.ads.deny.error.message"),
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