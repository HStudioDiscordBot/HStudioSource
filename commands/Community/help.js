const lang = require('../../lang.json');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Colors } = require('discord.js');

function createSelectMenu(help, music, cradit, locale) {
  const langs = {
    th: {
      help: "รายละเอียด",
      music: "คำสั่งต่างๆ",
      cradit: "เครดิต"
    },
    "en-us": {
      help: "Info",
      music: "Commands",
      cradit: "Developer"
    }
  };

  const localLang = langs[locale] || langs['en-us'];

  return new StringSelectMenuBuilder()
  .setCustomId('helpselection')
  .addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel(localLang.help)
      .setValue('helphelp')
      .setEmoji('📙')
      .setDefault(help),
    new StringSelectMenuOptionBuilder()
      .setLabel(localLang.music)
      .setValue('helpmusic')
      .setEmoji('🎵')
      .setDefault(music),
    new StringSelectMenuOptionBuilder()
      .setLabel(localLang.cradit)
      .setValue('helpcradit')
      .setEmoji('📌')
      .setDefault(cradit),
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(lang.default.commands.help.description)
    .setDescriptionLocalizations({
      th: lang.th.commands.help.description,
    }),
  async execute(interaction, client) {
    const locale = interaction.locale;
    const mainEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("รายละเอียด")
      .setDescription(`> If you want to use bot in English\n> Please change discord language to EN (either US or UK)\n> **[คู่มือฉบับเต็ม](https://hstudio.hewkawar.xyz/docs)**\n\n> 📌 ลิงก์ที่มีประโยชน์\n> **[เชิญบอท ${client.user.displayName}](${"https://discord.com/oauth2/authorize?client_id=" + process.env.CLIENT_ID + "&scope=bot%20applications.commands&permissions=36825160"})**\n> **[Discord ช่วยเหลือ](https://discord.gg/PmzsmyAY9z)**`)

    const helpSelection = createSelectMenu(true, false, false, locale);

    const row = new ActionRowBuilder()
      .addComponents(helpSelection);

    const message = await interaction.reply({ embeds: [mainEmbed], components: [row] });

    const filter = (interaction) => interaction.customId === 'helpselection';
    const collecter = await message.createMessageComponentCollector({ filter, time: 15_000 });

    collecter.on('collect', async i => {
      if (i.values[0] === 'helphelp') {
        const helpSelection = createSelectMenu(true, false, false, locale);

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);

        const helpEmbed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle("รายละเอียด")
          .setDescription(`> If you want to use bot in English\n> Please change discord language to EN (either US or UK)\n> **[คู่มือฉบับเต็ม](https://hstudio.hewkawar.xyz/docs)**\n\n> 📌 ลิงก์ที่มีประโยชน์\n> **[เชิญบอท ${client.user.displayName}](${"https://discord.com/oauth2/authorize?client_id=" + process.env.CLIENT_ID + "&scope=bot%20applications.commands&permissions=36825160"})**\n> **[Discord ช่วยเหลือ](https://discord.gg/PmzsmyAY9z)**`);

        await i.update({ embeds: [helpEmbed], components: [row] });
        await collecter.resetTimer();
      } else if (i.values[0] === 'helpmusic') {
        const helpSelection = new createSelectMenu(false, true, false, locale);

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);

        let commandList = "";

        await client.commandsData.map((command) => {
          if (locale == "th") commandList = commandList + `> </${command.name}:${command.id}> ${command.description_localizations.th} \n`;
          else commandList = commandList + `> </${command.name}:${command.id}> ${command.description} \n`;
        })

        const musicEmbed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle(`คำสั่งของ ${client.user.displayName}`)
          .setDescription(`${commandList}`);

        await i.update({ embeds: [musicEmbed], components: [row] })
        await collecter.resetTimer();
      } else if (i.values[0] === 'helpcradit') {
        const helpSelection = createSelectMenu(false, false, true, locale);

        const row = new ActionRowBuilder()
          .addComponents(helpSelection);
        const craditEmbed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle(`รายชื่อผู้ร่วมพัฒนา ${client.user.displayName}`)
          .setDescription(`> <@758681611251744788> เจ้าของ (ผู้พัฒนาหลัก)`);

        await i.update({ embeds: [craditEmbed], components: [row] })
        await collecter.resetTimer();
      }
    })

    collecter.on('end', async collected => {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(Colors.Yellow)
          .setTitle("⌛ หมดเวลาแล้วกรุณาใช้ /help อีกครั้งเพื่อเปิดเมนูช่วยเหลือ")
        ],
        components: []
      })
    })
  },
};
