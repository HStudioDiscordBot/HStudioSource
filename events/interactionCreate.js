const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return

        try {
            await command.execute(interaction, client);
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`Unavailable Command!`)
                .setDescription(`\`\`\`${error}\`\`\``);

            console.log(error);
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};