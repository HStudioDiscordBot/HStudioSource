const { EmbedBuilder } = require("discord.js");
const lang = require("../lang.json")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return

        try {
            await command.execute(interaction, client);
        } catch (error) {
            const requestedLocalization = lang[interaction.locale] || lang.default;

            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`${requestedLocalization.commands.error.execute}`)
                .setDescription(`\`\`\`${error}\`\`\``);

            console.log(error);
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};