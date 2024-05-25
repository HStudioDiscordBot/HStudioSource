const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, Colors } = require('discord.js');
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
            Volume: level
        });

        const config = await getConfig(guildId)

        return config
    } catch (error) {
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
                    .setColor(Colors.Blue)
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                ],
                ephemeral: true
            });
        }

        if (parseInt(level) <= 0 || parseInt(level) > 100) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`:warning: ${level} ${requestedLocalization.commands.error.it_should_between_1_100}`)
                    .setColor(Colors.Blue)
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                ],
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const configData = await getConfig(interaction.guild.id);

        if (configData.id) {
            const updatedConfig = await updateConfig(interaction.guild.id, parseInt(level));

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⚙️ ${interaction.guild.name}'s Config`)
                    .setColor(Colors.Blue)
                    .setFields(
                        { name: "Guild ID", value: `\`\`\`${updatedConfig.GuildId}\`\`\``, inline: false },
                        { name: "Loop", value: `\`\`\`${updatedConfig.Loop}\`\`\``, inline: true },
                        { name: "Speed", value: `\`\`\`x${updatedConfig.Speed}\`\`\``, inline: true },
                        { name: ":recycle: Volume", value: `\`\`\`${updatedConfig.Volume}\`\`\``, inline: true },
                    )
                    .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                    .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                    .setImage("https://cdn.jsdelivr.net/gh/HStudioDiscordBot/HStudioSource@main/assets/banner/serverconfig.png")
                ],
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
