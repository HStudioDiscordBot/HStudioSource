const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { inviteURL } = require('../../config.json');
const { version } = require('../../package.json');
const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(lang.default.commands_invite_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_invite_description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        await interaction.reply({ embeds: [ new EmbedBuilder().setColor('Green').setDescription(`> **อยากเชิญบอทไปเปิดเพลงให้ฟังละซิ**\n[กดที่นี่เพื่อเชิญ](${inviteURL})`).setFooter({ text: `HStudio | ${requestedLocalization.version}: ${version}` })]});
    },
};
