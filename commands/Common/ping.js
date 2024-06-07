const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
const { version } = require("../../package.json");
const Locale = require("../../class/Locale");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping")
        .setDescriptionLocalizations({
            th: "เช็คปิง"
        }),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        const startTime = Date.now();

        const pingTest = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setDescription(locale.getLocaleString("command.ping.pinging"))
                    .setFooter({ text: locale.replacePlaceholders(locale.getLocaleString("command.footer"), [client.user.displayName, version]) })
                ]
        });

        const endTime = Date.now();
        const ping = endTime - startTime;

        await pingTest.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.ping.description"), [ping, client.ws.ping]))
                    .setFooter({ text: locale.replacePlaceholders(locale.getLocaleString("command.footer"), [client.user.displayName, version]) })
            ]
        });
    }
}