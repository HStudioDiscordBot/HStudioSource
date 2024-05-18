const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
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

        await interaction.reply({ embeds: [ new EmbedBuilder().setColor(Colors.Blue).setDescription(`> **${requestedLocalization.commands.invite.execute.main}**\n[${requestedLocalization.commands.invite.execute.click}](${"https://discord.com/oauth2/authorize?client_id=" + process.env.CLIENT_ID + "&scope=bot%20applications.commands&permissions=36825160"})`).setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })]});
    },
};
