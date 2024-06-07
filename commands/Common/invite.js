const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
const { version } = require("../../package.json");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite Bot")
        .setDescriptionLocalizations({
            th: "เชิญบอท"
        }),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setDescription(locale.replacePlaceholders(locale.getLocaleString(command.invite.description), [`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}`]))
                    .setFooter({
                        text: locale.replacePlaceholders(locale.getLocaleString("command.footer"), [client.user.displayName, version])
                    })
            ]
        });
    }
}