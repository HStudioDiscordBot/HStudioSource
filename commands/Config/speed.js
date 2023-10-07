const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speed')
        .setDescription(lang.default.commands.speed.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.speed.description,
        })
        .addStringOption(option =>
            option.setName('level')
                .setDescription(lang.default.commands.speed.StringOption.level.description)
                .setDescriptionLocalizations({
                    th: lang.th.commands.speed.StringOption.level.description,
                })
                .setRequired(true)
                .addChoices(
                    { name: 'x2.0', value: '20' },
                    { name: 'x1.5', value: '15' },
                    { name: 'x1.0', value: '10' },
                    { name: 'x0.5', value: '05' },
                )),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const level = interaction.options.getString('level');

        await interaction.reply({ embeds: [ new EmbedBuilder().setTitle(`${interaction.commandName}`).setColor('Green').setDescription(`${level}`)]});
    },
};
