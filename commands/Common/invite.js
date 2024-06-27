const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { version } = require("../../package.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite Bot")
        .setDescriptionLocalizations({
            th: "เชิญบอท"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.invite.description"), [`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}`]))
                    .setFooter({
                        text: locale.replacePlaceholders(locale.getLocaleString("command.footer"), [client.user.displayName, version])
                    })
            ]
        });
    }
};