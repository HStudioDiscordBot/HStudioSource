const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitetopricatevoicechat')
    .setDescription("Create New Poll")
    .setDescriptionLocalizations({
      th: "สร้างโพลล์ใหม่",
    })
    .addUserOption(option =>
      option.setName('member')
        .setDescription("Select the member to invite")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "เลือผู้ใช้ที่ต้องการเชิญ",
        })),
  async execute(interaction, client) {
    const member = interaction.options.getMember('member');
    const user = interaction.member;

    if (!user.voice.channel) {
        await interaction.reply({
            content: 'You must be in a voice channel to invite someone.',
            ephemeral: true,
        });
        return;
    }

    const voiceChannel = user.voice.channel;

    voiceChannel.permissionOverwrites.edit(member, {
        'ViewChannel': true,
        'Connect': true,
        'Speak': true,
    });
    
    await interaction.reply({
        content: `Invited ${member.user.tag} to the private voice channel.`,
        ephemeral: true,
    });

    await user.send({ embeds: [new EmbedBuilder().setDescription(`**You have invited to join ${voiceChannel}**`).setColor('Green').setTimestamp(Date.now()).setFooter({text: `Invited by ${interaction.member.displayName}`,iconURL: `${interaction.member.displayAvatarURL({ extension: 'png' })}`})]});
},
};
