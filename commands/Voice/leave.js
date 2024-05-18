const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(lang.default.commands.leave.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.leave.description,
        }),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (connection) {
            connection.destroy();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Blue).setTitle(`🔴 ${requestedLocalization.commands.leave.execute.success}`)] });
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Blue).setTitle(`🔴 ${requestedLocalization.commands.leave.execute.not_in_voice_channel}`)] });
        }
        
    },
};
