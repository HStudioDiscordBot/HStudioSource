const { SlashCommandBuilder, EmbedBuilder, Colors, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

const contributors = require("../../contributors.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help")
        .setDescriptionLocalizations({
            th: "คำสั่งช่วยเหลือบอท"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        function createSelectMenu(help, command, contributor) {
            return new StringSelectMenuBuilder()
                .setCustomId("helpselection")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(locale.getLocaleString("command.help.helpselection.help"))
                        .setValue("helphelp")
                        .setEmoji("📙")
                        .setDefault(help),
                    new StringSelectMenuOptionBuilder()
                        .setLabel(locale.getLocaleString("command.help.helpselection.command"))
                        .setValue("helpcommand")
                        .setEmoji("🎵")
                        .setDefault(command),
                    new StringSelectMenuOptionBuilder()
                        .setLabel(locale.getLocaleString("command.help.helpselection.contributor"))
                        .setValue("helpcontributor")
                        .setEmoji("📌")
                        .setDefault(contributor),
                );
        }

        try {
            await interaction.deferReply();

            let commandList = "";

            await client.commandsData.map((command) => {
                if (interaction.locale == "th") commandList += `> </${command.name}:${command.id}> | ${command.description_localizations.th} \n`;
                else commandList += `> </${command.name}:${command.id}> | ${command.description} \n`;
            });

            const mainEmbed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale.getLocaleString("command.help.helpselection.help"))
                .setDescription(locale.getLocaleString("command.help.help.description"))
                .addFields(
                    {
                        name: locale.getLocaleString("command.help.help.field.usefullinks"),
                        value: locale.replacePlaceholders(locale.getLocaleString("command.help.help.field.usefullinks.value"), [`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}`]),
                        inline: false
                    }
                );

            const commandsEmbed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale.getLocaleString("command.help.helpselection.command"))
                .setDescription(commandList);

            const contributorsEmbed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale.getLocaleString("command.help.helpselection.contributor"))
                .setDescription(`${contributors.map(contributor => { return `- **[${contributor.name}](${contributor.links.github.url})** | <@${contributor.links.discord.id}>`; })}`);

            const selection = createSelectMenu(true, false, false);
            const selectionActionRow = new ActionRowBuilder().addComponents(selection);

            const message = await interaction.editReply({
                embeds: [mainEmbed],
                components: [selectionActionRow]
            });

            const filter = (interaction) => interaction.customId === "helpselection";

            const collecter = message.createMessageComponentCollector({ filter, time: 60_000 });

            collecter.on("collect", async (i) => {
                switch (i.values[0]) {
                    case "helphelp": {
                        const helpActionRow = new ActionRowBuilder().addComponents(createSelectMenu(true, false, false));

                        await i.update({
                            embeds: [mainEmbed],
                            components: [helpActionRow]
                        });
                        break;
                    }
                    case "helpcommand": {
                        const commandsActionRow = new ActionRowBuilder().addComponents(createSelectMenu(false, true, false));

                        await i.update({
                            embeds: [commandsEmbed],
                            components: [commandsActionRow]
                        });
                        break;
                    }
                    case "helpcontributor": {
                        const contributorActionRow = new ActionRowBuilder().addComponents(createSelectMenu(false, false, true));

                        await i.update({
                            embeds: [contributorsEmbed],
                            components: [contributorActionRow]
                        });
                        break;
                    }
                }
                collecter.resetTimer();
            });

            collecter.on("end", async () => {
                try {
                    if (message) {
                        await message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Colors.Yellow)
                                    .setTitle(locale.getLocaleString("command.help.timeout"))
                            ],
                            components: []
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
};