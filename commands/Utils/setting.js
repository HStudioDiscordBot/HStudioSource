const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const DefaultSourceSchema = require("../../schemas/DefaultSource");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setting")
        .setDescription("Setting")
        .setDescriptionLocalizations({
            th: "การตั้งค่า"
        })
        .addSubcommand((sub) =>
            sub.setName("search")
                .setDescription("Change default search source")
                .setDescriptionLocalizations({
                    th: "การตั้งค่าการค้นหาเริ่มต้น"
                })
                .addStringOption((option) =>
                    option
                .setName("source")
                .setDescription("Source")
                .setDescriptionLocalizations({
                    th: "แหล่งที่มา"
                })
                .setRequired(true)
                .setChoices(
                        {
                            name: "Spotify",
                            value: "spotify"
                        },
                        {
                            name: "Youtube",
                            value: "youtube"
                        },
                        {
                            name: "Youtube Music",
                            value: "youtube_music"
                        }
                    ))
        ),

    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "search": {
                await interaction.deferReply();
                const source = interaction.options.getString("source");

                if (!source) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.setting.search.save.fail"), [source]))
                    ]
                });

                const oldConfig = await DefaultSourceSchema.findOne({
                    userId: interaction.user.id
                });

                if (oldConfig) {
                    await DefaultSourceSchema.updateOne({
                        userId: interaction.user.id
                    }, {
                        source: source
                    });
                } else {
                    await DefaultSourceSchema.create({
                        userId: interaction.user.id,
                        source: source
                    });
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.setting.search.saved"), [source]))
                    ]
                });
            }
        }
    }
};