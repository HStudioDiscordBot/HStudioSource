const configFile = require('../../config.json');

const lang = require('../../lang.json');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = configFile.app[configFile.appName] || configFile.app.debug;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(lang.default.commands.help.description)
    .setDescriptionLocalizations({
      th: lang.th.commands.help.description,
    }),
  async execute(interaction, client) {
    const mainEmbed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription(`> If you want to use bot in English\n> Please change discord language to EN (either US or UK)\n> **[คู่มือฉบับเต็ม](https://hstudio.hewkawar.xyz/docs)**\n\n> 📌 ลิงก์ที่มีประโยชน์\n> **[เชิญบอท ${client.user.displayName}](${config.inviteURL})**\n> **[Discord ช่วยเหลือ](https://discord.gg/PmzsmyAY9z)**`)

    const helpSelection = new StringSelectMenuBuilder()
      .setCustomId('helpselection')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('ช่วยเหลือ')
          .setValue('helphelp')
          .setEmoji('📙')
          .setDefault(true),
        new StringSelectMenuOptionBuilder()
          .setLabel('คำสั่งเพลง')
          .setValue('helpmusic')
          .setEmoji('🎵'),
        new StringSelectMenuOptionBuilder()
          .setLabel('เครดิต')
          .setValue('helpcradit')
          .setEmoji('📌'),
      );


    const row = new ActionRowBuilder()
      .addComponents(helpSelection);

    const message = await interaction.reply({ embeds: [mainEmbed], components: [row] });

    const filter = (interaction) => interaction.customId === 'helpselection';
    const collecter = await message.createMessageComponentCollector({ filter, time: 15_000 });

    collecter.on('collect', async i => {
      if (i.values[0] === 'helphelp') {
        const helpSelection = new StringSelectMenuBuilder()
          .setCustomId('helpselection')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('ช่วยเหลือ')
              .setValue('helphelp')
              .setEmoji('📙')
              .setDefault(true),
            new StringSelectMenuOptionBuilder()
              .setLabel('คำสั่งเพลง')
              .setValue('helpmusic')
              .setEmoji('🎵'),
            new StringSelectMenuOptionBuilder()
              .setLabel('เครดิต')
              .setValue('helpcradit')
              .setEmoji('📌'),
          );

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);

        const helpEmbed = new EmbedBuilder()
          .setColor(config.color)
          .setDescription(`> If you want to use bot in English\n> Please change discord language to EN (either US or UK)\n> **[คู่มือฉบับเต็ม](https://hstudio.hewkawar.xyz/docs)**\n\n> 📌 ลิงก์ที่มีประโยชน์\n> **[เชิญบอท ${client.user.displayName}](${config.inviteURL})**\n> **[Discord ช่วยเหลือ](https://discord.gg/PmzsmyAY9z)**`);

        await i.update({ embeds: [helpEmbed], components: [row] });
      } else if (i.values[0] === 'helpmusic') {
        const helpSelection = new StringSelectMenuBuilder()
          .setCustomId('helpselection')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('ช่วยเหลือ')
              .setValue('helphelp')
              .setEmoji('📙'),
            new StringSelectMenuOptionBuilder()
              .setLabel('คำสั่งเพลง')
              .setValue('helpmusic')
              .setEmoji('🎵')
              .setDefault(true),
            new StringSelectMenuOptionBuilder()
              .setLabel('เครดิต')
              .setValue('helpcradit')
              .setEmoji('📌'),
          );

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);

        let commandList = "";

        for (var l = 0; l < config.commands.length; l++) {
          commandList = commandList + `> </${config.commands[l].name}:${config.commands[l].id}> ${config.commands[l].description} \n`;
        }

        const musicEmbed = new EmbedBuilder()
          .setColor(config.color)
          .setDescription(`${commandList}`);


        await i.update({ embeds: [musicEmbed], components: [row] })
      } else if (i.values[0] === 'helpcradit') {
        const helpSelection = new StringSelectMenuBuilder()
          .setCustomId('helpselection')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('ช่วยเหลือ')
              .setValue('helphelp')
              .setEmoji('📙'),
            new StringSelectMenuOptionBuilder()
              .setLabel('คำสั่งเพลง')
              .setValue('helpmusic')
              .setEmoji('🎵'),
            new StringSelectMenuOptionBuilder()
              .setLabel('เครดิต')
              .setValue('helpcradit')
              .setEmoji('📌')
              .setDefault(true),
          );

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);
        const craditEmbed = new EmbedBuilder()
          .setColor(config.color)
          .setDescription(`> **รายชื่อผู้ร่วมพัฒนา ${client.user.displayName}**\n\n> <@758681611251744788> เจ้าของ (ผู้พัฒนาหลัก)`);

        await i.update({ embeds: [craditEmbed], components: [row] })
      }
    })

    collecter.on('end', async collected => {
      await interaction.deleteReply()
    } )
  },
};
