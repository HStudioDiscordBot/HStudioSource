const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;
const { version } = require('../../package.json')
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(lang.default.commands.ping.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.ping.description,
        }),
    async execute(interaction, client) {
        const startTime = Date.now();

        const requestedLocalization = lang[interaction.locale] || lang.default;

        const pingTest = await interaction.reply({ embeds: [ new EmbedBuilder().setColor(config.color).setDescription(`🏓 ${requestedLocalization.commands.ping.execute.ping}`).setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })]});

        const endTime = Date.now();
        const ping = endTime - startTime;

        await pingTest.edit({ contant: null, embeds: [new EmbedBuilder().setColor(config.color).setDescription(`🏓 ${requestedLocalization.commands.ping.execute.pong}! ${requestedLocalization.commands.ping.execute.bot_latency}: \`${ping}\` ${requestedLocalization.commands.ms}\n${requestedLocalization.commands.ping.execute.api_latency}: \`${client.ws.ping}\` ${requestedLocalization.commands.ms}`).setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })] });
    },
};
