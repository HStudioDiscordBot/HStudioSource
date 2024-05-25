const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { version } = require('../../package.json');
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(lang.default.commands.config.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.config.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        await interaction.deferReply();

        const configData = await getConfig(interaction.guild.id);

        if (configData.id) {
            const configEmbed = new EmbedBuilder()
                .setTitle(`⚙️ ${interaction.guild.name}'s Config`)
                .setColor(Colors.Blue)
                .setFields(
                    { name: "Guild Id", value: `\`\`\`${configData.GuildId}\`\`\``, inline: false },
                    { name: "Loop", value: `\`\`\`${configData.Loop}\`\`\``, inline: true },
                    { name: "Speed", value: `\`\`\`x${configData.Speed}\`\`\``, inline: true },
                    { name: "Volume", value: `\`\`\`${configData.Volume}\`\`\``, inline: true },
                )
                .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
                .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
                .setImage("https://cdn.jsdelivr.net/gh/HStudioDiscordBot/HStudioSource@main/assets/banner/serverconfig.png");

            return await interaction.editReply({ embeds: [configEmbed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`⚠️ Can't connect to server!`)
                .setDescription('Please try again later')
                .setTimestamp(Date.now())
            return await interaction.editReply({ embeds: [embed] })
        }
    },
};
