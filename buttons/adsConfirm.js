const { ButtonInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
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
            content: "Unknow ads Id",
            ephemeral: true
        });

        await interaction.deferReply({ ephemeral: true });

        try {
            const adsData = await AdSchema.findById(adsId);

            if (!adsData) return await interaction.editReply({
                content: "Unknow ads",
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
                                .setDescription(`Your ad ID \`${adsData._id}\` has been verified.\nYou can use /ads enable to activate your ad.`)
                        ]
                    });
                }

                await interaction.editReply({
                    content: `✅ Activated ads ${adsData._id}`,
                    ephemeral: true
                });

                embed
                    .setColor(Colors.Green)
                    .addFields({
                        name: "Activate at",
                        value: new Date().toLocaleDateString()
                    });

                await message.edit({
                    embeds: [embed],
                    components: []
                });
            } catch (err) {
                await interaction.editReply({
                    content: `✅ Activated ads ${adsData._id} (Can't send notification to the owner)`,
                    ephemeral: true
                });
            }
        } catch (err) {
            await interaction.editReply({
                content: "Error while adsConfirm",
                ephemeral: true
            });
        }
    }
}