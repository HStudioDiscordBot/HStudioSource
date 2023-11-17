const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

const lang = require('../../lang.json');
const configFile = require('../../config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription(lang.default.commands.join.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.join.description,
        }),
    async execute(interaction) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        let connection = getVoiceConnection(interaction.guild.id);

        if (!interaction.member.voice.channel) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning: ${requestedLocalization.commands.error.please_join_before_use_bot}`).setColor("Yellow")] });
        }

        if (!connection) {
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.color).setTitle(`🟢 ${requestedLocalization.commands.join.execute.success}`)]});
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.color).setTitle(`🟢 ${requestedLocalization.commands.join.execute.already_join}`)]});
        }

        await interaction.guild.members.me.edit({
            deaf: true,
            mute: false,
        });
    },
};
