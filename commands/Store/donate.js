const { SlashCommandBuilder, CommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate to Support Bot Developer")
        .setDescriptionLocalizations({
            th: "บริจาคเงินช่วยพัฒนาบอท"
        }),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        const modal = new ModalBuilder()
            .setTitle(locale.getLocaleString("command.donate.modal.title"))
            .setCustomId("donate");

        const urlInput = new TextInputBuilder()
            .setCustomId("url")
            .setRequired(true)
            .setPlaceholder("https://gift.truemoney.com/campaign/?v=xxxxx")
            .setLabel(locale.getLocaleString("command.donate.modal.urlInput.label"))
            .setStyle(TextInputStyle.Short);

        const urlActionRow = new ActionRowBuilder().addComponents(urlInput);

        modal.addComponents(urlActionRow);

        await interaction.showModal(modal);
    }
}