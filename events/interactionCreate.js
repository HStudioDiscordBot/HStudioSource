const { Events, Client, Interaction, Colors, EmbedBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder } = require("discord.js");
const Locale = require("../class/Locale");
const donateModal = require("../modals/donate");
const createAdsModal = require("../modals/create_ads");
const buttonCreateAds = require("../buttons/buttonCreateAds");

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

            if (customId == "donate") {
                donateModal.execute(interaction, client, locale);
            } else if (customId == "create_ads") {
                createAdsModal.execute(interaction, client, locale);
            }
        } else if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId == "buttonCreateAds") {
                buttonCreateAds.execute(interaction, client, locale);
            }
        }
    }
}