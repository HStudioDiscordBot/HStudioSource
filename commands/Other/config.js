const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(lang.default.commands_config_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_config_description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

    },
};
