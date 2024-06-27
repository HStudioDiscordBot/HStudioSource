const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { version } = require("../../package.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping")
        .setDescriptionLocalizations({
            th: "เช็คปิง"
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
                    .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.ping.description"), [Date.now() - interaction.createdTimestamp, client.ws.ping]))
                    .setFooter({ text: locale.replacePlaceholders(locale.getLocaleString("command.footer"), [client.user.displayName, version]) })
            ]
        });
    }
};