const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

const lang = require('../../lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription(lang.default.commands_join_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_join_description,
        }),
    async execute(interaction) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        let connection = getVoiceConnection(interaction.guildId);

        if (!interaction.member.voice.channel) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning:: ${requestedLocalization.commands_play_error_please_join_before_use_bot}`).setColor("Yellow")] });
        }

        if (!connection) {
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            await interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('🟢: เข้าห้องเสียงแล้ว')]});
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('🟢: บอทอยู่ในห้องเสียงอยู่แล้ว')]});
        }

        await interaction.guild.members.me.edit({
            deaf: true,
            mute: false,
        });
    },
};
