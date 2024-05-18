const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, Colors } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json')
const lang = require('../../lang.json');

async function getConfig(guildID) {
    try {
        const response = await axios.get(`https://api.hewkawar.xyz/app/hstuido/config?id=${guildID}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateConfig(guildID, oldConfig, level) {
    try {
        const response = await axios.post(`https://api.hewkawar.xyz/app/hstuido/config`, { id: guildID, speed: `${level}` });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

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

        const configData = await getConfig(interaction.guild.id);

        if (configData.id) {
            const file = new AttachmentBuilder('assets/banner/serverconfig.png');

            const configEmbed = new EmbedBuilder()
                .setTitle(`:gear: ${interaction.guild.name}'s Config`)
                .setColor(Colors.Blue)
                .setFields(
                    { name: "Guild ID", value: `\`\`\`${configData.id}\`\`\``, inline: false },
                    { name: "Loop", value: `\`\`\`${configData.loop}\`\`\``, inline: true },
                    { name: "Speed", value: `\`\`\`x${configData.speed}\`\`\``, inline: true },
                    { name: "Volume", value: `\`\`\`${configData.volume}\`\`\``, inline: true },
                )
                .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                .setImage('attachment://serverconfig.png');

            const replyMessage = await interaction.reply({ embeds: [configEmbed], files: [file] });

            const updatedConfig = await updateConfig(interaction.guild.id, configData, parseInt(level) / 10);

            await replyMessage.edit({
                embeds: [new EmbedBuilder()
                    .setTitle(`:gear: ${interaction.guild.name}'s Config`)
                    .setColor(Colors.Blue)
                    .setFields(
                        { name: "Guild ID", value: `\`\`\`${updatedConfig.id}\`\`\``, inline: false },
                        { name: "Loop", value: `\`\`\`${updatedConfig.loop}\`\`\``, inline: true },
                        { name: ":recycle: Speed", value: `\`\`\`x${updatedConfig.speed}\`\`\``, inline: true },
                        { name: "Volume", value: `\`\`\`${updatedConfig.volume}\`\`\``, inline: true },
                    )
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                    .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                    .setImage('attachment://serverconfig.png')
                ], files: [file]
            });
        } else {
            const embed = new EmbedBuilder()
            .setTitle(`⚠️ Can't connect to server!`)
            .setDescription('Please try again later')
            .setTimestamp(Date.now())
            return await interaction.reply({ embeds: [embed]})
        }
    },
};
