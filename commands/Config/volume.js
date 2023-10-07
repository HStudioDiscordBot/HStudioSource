const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription(lang.default.commands.volume.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.volume.description,
        })
        .addStringOption(option =>
            option.setName('level')
                .setDescription(lang.default.commands.volume.StringOption.level.description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands.volume.StringOption.level.description,
                })),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const level = interaction.options.getString('level');

        await interaction.reply({ embeds: [ new EmbedBuilder().setTitle(`${interaction.commandName}`).setColor('Green').setDescription(`${level}`)]});
    },
};
