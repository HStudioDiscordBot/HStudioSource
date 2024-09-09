const { Events, Colors, EmbedBuilder } = require("discord.js");
const Locale = require("../class/Locale");
const donateModal = require("../modals/donate");
const createAdsModal = require("../modals/create_ads");
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

/**
 * Handle command execution.
 * 
 * @param {import("discord.js").Interaction} interaction 
 * @param {import("discord.js").Client} client 
 * @param {Locale} locale 
 */
async function handleCommand(interaction, client, locale) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client, locale);
    } catch (err) {
        console.log(err);
        const replyPayload = {
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle(locale.getLocaleString("interaction.command.error"))
                    .setDescription(`\`\`\`${err}\`\`\``)
            ],
            ephemeral: true
        };
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(replyPayload);
            } else if (!interaction.replied) {
                await interaction.reply(replyPayload);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

/**
 * Handle interaction based on type.
 * 
 * @param {import("discord.js").Interaction} interaction 
 * @param {import("discord.js").Client} client 
 * @param {Locale} locale 
 */
async function handleInteraction(interaction, client, locale) {
    if (interaction.isCommand()) {
        await handleCommand(interaction, client, locale);
    } else if (interaction.isModalSubmit()) {
        const modals = {
            "donate": donateModal.execute,
            "create_ads": createAdsModal.execute
        };

        const action = modals[interaction.customId];
        if (action) await action(interaction, client, locale);
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

        if (client.status != "online") {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(locale.getLocaleString("interaction.client.notOnline"))
                ],
                ephemeral: true
            });
        }

        await handleInteraction(interaction, client, locale);

        try {
            await saveLastUserLocale(interaction.user.id, interaction.locale);
        } catch (err) {
            console.error(err);
        }
    }
};