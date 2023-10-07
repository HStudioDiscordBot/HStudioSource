const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { version } = require('../../package.json')
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(lang.default.commands_ping_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_ping_description,
        }),
    async execute(interaction, client) {
        const startTime = Date.now();

        const requestedLocalization = lang[interaction.locale] || lang.default;

        const pingTest = await interaction.reply({ embeds: [ new EmbedBuilder().setColor('Blue').setDescription('Ping...').setFooter({ text: `HStudio | ${requestedLocalization.version}: ${version}` })]});

        const endTime = Date.now();
        const ping = endTime - startTime;

        await pingTest.edit({ contant: null, embeds: [new EmbedBuilder().setColor('Blue').setDescription(`🏓 ${requestedLocalization.commands_ping_pong}! ${requestedLocalization.commands_ping_bot_latency}: \`${ping}\` ${requestedLocalization.ms}\n${requestedLocalization.commands_ping_api_latency}: \`${client.ws.ping}\` ${requestedLocalization.ms}`).setFooter({ text: `HStudio | ${requestedLocalization.version}: ${version}` })] });
    },
};
