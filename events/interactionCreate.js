const { Events, Colors, EmbedBuilder } = require("discord.js");
const Locale = require("../class/Locale");
const donateModal = require("../modals/donate");
const createAdsModal = require("../modals/create_ads");
const buttonCreateAds = require("../buttons/buttonCreateAds");
const buttonAdsConfirm = require("../buttons/adsConfirm");
const buttonAdsDeny = require("../buttons/adsDeny");
const LocaleSchema = require("../schemas/Locale");

/**
 * Save the last user locale.
 * 
 * @param {import("discord.js").Snowflake} userId - The ID of the user.
 * @param {import("discord.js").Locale} locale - The locale of the user.
 * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise false.
 */
async function saveLastUserLocale(userId, locale) {
    try {
        const updateResult = await LocaleSchema.updateOne(
            { owner: userId },
            { $set: { locale: locale } },
            { upsert: true }
        );

        return updateResult.acknowledged;
    } catch (err) {
        console.error(err);
        return false;
    }
}


module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     * @param {import("discord.js").Client} client 
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

            switch (customId) {
                case "donate":
                    await donateModal.execute(interaction, client, locale);
                    break;
                case "create_ads":
                    await createAdsModal.execute(interaction, client, locale);
                    break;
            }
        } else if (interaction.isButton()) {
            const customId = interaction.customId;

            switch (customId) {
                case "buttonCreateAds":
                    await buttonCreateAds.execute(interaction, client, locale);
                    break;
                case "adsConfirm":
                    await buttonAdsConfirm.execute(interaction, client, locale);
                    break;
                case "adsDeny":
                    await buttonAdsDeny.execute(interaction, client, locale);
                    break;
            }
        }

        try {
            saveLastUserLocale(interaction.user.id, interaction.locale);
        } catch (err) {
            console.error(err);
        }
    }
};