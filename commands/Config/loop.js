const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(lang.default.commands.loop.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.loop.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        await interaction.reply({ embeds: [ new EmbedBuilder().setTitle(`${interaction.commandName}`).setColor('Green')]});
    },
};
