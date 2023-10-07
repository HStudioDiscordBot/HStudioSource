const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription(lang.default.commands_volume_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_volume_description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        

    },
};
