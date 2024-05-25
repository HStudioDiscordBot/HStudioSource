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

async function updateConfig(guildId, oldConfig) {
    try {
        const toggleLoop = !oldConfig.Loop;

        await configSchema.updateOne({
            GuildId: guildId
        }, {
            Loop: toggleLoop
        });

        const config = await getConfig(guildId)

        return config
    } catch (error) {
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

        await interaction.deferReply();

        const configData = await getConfig(interaction.guild.id);

        if (configData.GuildId) {
            const updatedConfig = await updateConfig(interaction.guild.id, configData);

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⚙️ ${interaction.guild.name}'s Config`)
                    .setColor(Colors.Blue)
                    .setFields(
                        { name: "Guild ID", value: `\`\`\`${updatedConfig.GuildId}\`\`\``, inline: false },
                        { name: ":recycle: Loop", value: `\`\`\`${updatedConfig.Loop}\`\`\``, inline: true },
                        { name: "Speed", value: `\`\`\`x${updatedConfig.Speed}\`\`\``, inline: true },
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
