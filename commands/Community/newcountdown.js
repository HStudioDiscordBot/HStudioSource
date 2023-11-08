const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newcountdown')
    .setDescription("Create Countdown")
    .setDescriptionLocalizations({
      th: "สร้างการนับถอยหลังใหม่",
    })
    .addStringOption(option =>
      option.setName('title')
        .setDescription("Title")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "หัวเรื่อง",
        }))
    .addIntegerOption(option =>
      option.setName('dd')
        .setDescription("Day (ex. 31)")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "วันที่ (ตัวอย่าง: 31)",
        }))
    .addIntegerOption(option =>
      option.setName('mm')
        .setDescription("Month (ex. 12)")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "เดือน (ตัวอย่าง: 12)",
        }))
    .addIntegerOption(option =>
      option.setName('yyyy')
        .setDescription("Year (ex. 2023)")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "ปี (ตัวอย่าง: 2023)",
        }))
    .addIntegerOption(option =>
      option.setName('hh')
        .setDescription("Hour (ex. 23)")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "ชั่วโมง (ตัวอย่าง: 23)",
        }))
    .addIntegerOption(option =>
      option.setName('mn')
        .setDescription("Minute (ex. 59)")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "นาที (ตัวอย่าง: 59)",
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

    const dd = interaction.options.getInteger('dd');
    const mm = interaction.options.getInteger('mm')- 1;
    const yyyy = interaction.options.getInteger('yyyy');
    const hh = interaction.options.getInteger('hh');
    const mn = interaction.options.getInteger('mn');

    const countdownDate = new Date(yyyy, mm, dd, hh, mn);

    const targetChannel = client.channels.cache.get(config.Commands.newcountdown.id);

    const timestamp = `<t:${Math.floor(countdownDate / 1000)}:R>`;

    const countdownMessage = await targetChannel.send({ embeds: [new EmbedBuilder().setTitle(title).setDescription(description).setColor("Blue").addFields({ name: "Countdown ends", value: `${timestamp}`, inline: false}).setFooter({text: `Create Poll by ${interaction.member.displayName}`,iconURL: `${interaction.member.displayAvatarURL({ extension: 'png' })}`}).setTimestamp(Date.now())] });

    await interaction.reply({
      embeds: [new EmbedBuilder().setDescription(`Create Countdown Success view countdown in ${countdownMessage.url}`)],
      ephemeral: true
    });
  },
};
