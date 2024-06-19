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
            content: "Unknown ad ID",
            ephemeral: true
        });

        await interaction.deferReply({ ephemeral: true });

        try {
            const adsData = await AdSchema.findById(adsId);

            if (!adsData) return await interaction.editReply({
                content: "Unknown ad",
                ephemeral: false
            });

            await AdSchema.findByIdAndUpdate(adsId, {
                verify: false
            });

            const adsOwner = await client.users.fetch(adsData.owner);

            try {
                if (adsOwner) {
                    await adsOwner.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription(`Your ad ID \`${adsData._id}\` could not be verified.\nYou can contact the HStudio team to receive a 50% refund.`)
                        ]
                    });
                }

                await interaction.editReply({
                    content: `✅ Deleted ad ${adsData._id}`,
                    ephemeral: true
                });

                embed
                    .setColor(Colors.Red)

                await message.edit({
                    embeds: [embed],
                    components: []
                });
            } catch (err) {
                await interaction.editReply({
                    content: `✅ Ad ${adsData._id} has been activated (Unable to send notification to the owner)`,
                    ephemeral: true
                });
            }
        } catch (err) {
            await interaction.editReply({
                content: "Error during ad denial",
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