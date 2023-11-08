const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newpoll')
    .setDescription("Create New Poll")
    .setDescriptionLocalizations({
      th: "สร้างโพลล์ใหม่",
    })
    .addStringOption(option =>
      option.setName('title')
        .setDescription("Title")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "หัวเรื่อง",
        }))
    .addStringOption(option =>
      option.setName('description')
        .setDescription("Description")
        .setRequired(false)
        .setDescriptionLocalizations({
          th: "รายละเอียด",
        })),
  async execute(interaction, client) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    const targetChannel = client.channels.cache.get(config.Commands.newpoll.id);

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor("Blue")
      .setFooter({
        text: `Create Poll by ${interaction.member.displayName}`,
        iconURL: `${interaction.member.displayAvatarURL({ extension: 'png' })}`
      })
      .setTimestamp(Date.now());

    const pollMessage = await targetChannel.send({ embeds: [embed] })

    await interaction.reply({
      embeds: [new EmbedBuilder().setDescription(`Create Poll Success view poll in ${pollMessage.url}`)],
      ephemeral: true
    });

    await pollMessage.react('✅');
    await pollMessage.react('❌');
  },
};
