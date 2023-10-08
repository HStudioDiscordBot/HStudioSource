const { EmbedBuilder } = require("discord.js");
const lang = require("../lang.json");
const { version } = require('../package.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'bugreport') {
            const command = interaction.fields.getTextInputValue('command');
            const description = interaction.fields.getTextInputValue('description');

            const user_id = interaction.user.id;
            const member = interaction.member;
            const userDisplayName = interaction.user.username;
            const server_id = interaction.guild.id || 'No Server Provided';

            const channel = await client.channels.cache.get('1160443328211464244');

            const reportEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Report from ${userDisplayName}!`)
                .addFields({ name: "User ID", value: `${user_id}` })
                .addFields({ name: "Member", value: `${member}` })
                .addFields({ name: "Server ID", value: `${server_id}` })
                .addFields({ name: "Command Reported", value: `${command}` })
                .addFields({ name: "Reported Description", value: `${description}` })
                .setTimestamp()
                .setFooter({ text: `${client.user.displayName} | ${lang.default.commands.version}: ${version}` })

            await interaction.reply({ content: 'Your report has been Submitted', ephemeral: true});

            await channel.send({ embeds: [reportEmbed]});
        }
    },
};