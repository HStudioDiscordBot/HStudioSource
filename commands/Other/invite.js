const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;
const { version } = require('../../package.json');
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(lang.default.commands.invite.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.invite.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        await interaction.reply({ embeds: [ new EmbedBuilder().setColor(config.color).setDescription(`> **${requestedLocalization.commands.invite.execute.main}**\n[${requestedLocalization.commands.invite.execute.click}](${config.inviteURL})`).setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })]});
    },
};
