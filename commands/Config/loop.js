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

async function updateConfig(guildID, oldConfig) {
    try {
        let isLoop;
        if (oldConfig.loop === 'false') {
            isLoop = 'true';
        } else if (oldConfig.loop === 'true') {
            isLoop = 'false';
        }
        const response = await axios.post(`https://api.hewkawar.xyz/app/hstuido/config`, { id: guildID, loop: isLoop });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(lang.default.commands.loop.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.loop.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const configData = await getConfig(interaction.guild.id);

        if (configData.id) {

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

            const updatedConfig = await updateConfig(interaction.guild.id, configData);

            await replyMessage.edit({
                embeds: [new EmbedBuilder()
                    .setTitle(`:gear: ${interaction.guild.name}'s Config`)
                    .setColor(config.color)
                    .setFields(
                        { name: "Guild ID", value: `\`\`\`${updatedConfig.id}\`\`\``, inline: false },
                        { name: ":recycle: Loop", value: `\`\`\`${updatedConfig.loop}\`\`\``, inline: true },
                        { name: "Speed", value: `\`\`\`x${updatedConfig.speed}\`\`\``, inline: true },
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
