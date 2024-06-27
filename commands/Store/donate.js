const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate to Support Bot Developer")
        .setDescriptionLocalizations({
            th: "บริจาคเงินช่วยพัฒนาบอท"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, locale) {
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