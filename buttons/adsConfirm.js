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
                                .setDescription(`Your ad with ID \`${adsData._id}\` has been verified.\nYou can use the command /ads enable to activate your ad.`)
                            ]
                    });
                }

                await interaction.editReply({
                    content: `✅ Ad ${adsData._id} has been activated`,
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
                                    .setDescription(`Ad \`${adsData._id}\` has been activated!`)
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
                    content: `✅ Ad ${adsData._id} has been activated (Unable to send notification to the owner)`,
                    ephemeral: true
                });
            }
        } catch (err) {
            await interaction.editReply({
                content: "Error during ad confirmation",
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