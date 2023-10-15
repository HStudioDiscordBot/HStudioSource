const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const configFile = require('../../config.json');
const config = configFile.app[configFile.appName] || configFile.app.debug;
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
        const response = await axios.post(`https://api.hewkawar.xyz/app/hstuido/config`, { id: guildID, volume: level });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription(lang.default.commands.volume.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.volume.description,
        })
        .addStringOption(option =>
            option.setName('level')
                .setDescription(lang.default.commands.volume.StringOption.level.description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands.volume.StringOption.level.description,
                })),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const level = interaction.options.getString('level');

        if (isNaN(level)) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`:warning: ${level} ${requestedLocalization.commands.error.is_not_number}`)
                    .setColor(config.color)
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                ],
                ephemeral: true
            });
        }

        if (parseInt(level) <= 0 || parseInt(level) > 100) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`:warning: ${level} ${requestedLocalization.commands.error.it_should_between_1_100}`)
                    .setColor(config.color)
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                ],
                ephemeral: true
            });
        }

        const configData = await getConfig(interaction.guild.id);

        const file = new AttachmentBuilder('assets/banner/serverconfig.png');

        const configEmbed = new EmbedBuilder()
            .setTitle(`:gear: ${interaction.guild.name}'s Config`)
            .setColor(config.color)
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

        const updatedConfig = await updateConfig(interaction.guild.id, configData, parseInt(level));

        await replyMessage.edit({
            embeds: [new EmbedBuilder()
                .setTitle(`:gear: ${interaction.guild.name}'s Config`)
                .setColor(config.color)
                .setFields(
                    { name: "Guild ID", value: `\`\`\`${updatedConfig.id}\`\`\``, inline: false },
                    { name: "Loop", value: `\`\`\`${updatedConfig.loop}\`\`\``, inline: true },
                    { name: "Speed", value: `\`\`\`x${updatedConfig.speed}\`\`\``, inline: true },
                    { name: ":recycle: Volume", value: `\`\`\`${updatedConfig.volume}\`\`\``, inline: true },
                )
                .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                .setImage('attachment://serverconfig.png')
            ], files: [file]
        });
    },
};
