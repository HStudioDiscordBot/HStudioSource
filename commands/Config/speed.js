const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, Colors } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json')
const lang = require('../../lang.json');
const configSchema = require('../../schemas/config');

async function getConfig(guildId) {
    try {
        let configData = await configSchema.findOne({
            GuildId: guildId
        });

        if (!configData) {
            configData = await configSchema.create({
                GuildId: guildId,
                Speed: 1.0,
                Loop: false,
                Volume: 100
            });
        }

        return configData;
    } catch (err) {
        return null;
    }
}

async function updateConfig(guildId, level) {
    try {
        await configSchema.updateOne({
            GuildId: guildId
        }, {
            Speed: level
        });

        const config = await getConfig(guildId)

        return config
    } catch (error) {
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

        await interaction.deferReply();

        const configData = await getConfig(interaction.guild.id);

        if (configData.id) {
            const updatedConfig = await updateConfig(interaction.guild.id, parseInt(level) / 10);

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⚙️ ${interaction.guild.name}'s Config`)
                    .setColor(Colors.Blue)
                    .setFields(
                        { name: "Guild ID", value: `\`\`\`${updatedConfig.GuildId}\`\`\``, inline: false },
                        { name: "Loop", value: `\`\`\`${updatedConfig.Loop}\`\`\``, inline: true },
                        { name: ":recycle: Speed", value: `\`\`\`x${updatedConfig.Speed}\`\`\``, inline: true },
                        { name: "Volume", value: `\`\`\`${updatedConfig.Volume}\`\`\``, inline: true },
                    )
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                    .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                    .setImage("https://cdn.jsdelivr.net/gh/HStudioDiscordBot/HStudioSource@main/assets/banner/serverconfig.png")
                ]
            });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`⚠️ Can't connect to server!`)
                .setDescription('Please try again later')
                .setTimestamp(Date.now())
            return await interaction.editReply({ embeds: [embed] })
        }
    },
};
