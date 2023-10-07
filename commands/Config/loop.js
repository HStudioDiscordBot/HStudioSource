const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(lang.default.commands_loop_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_loop_description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

    },
};
