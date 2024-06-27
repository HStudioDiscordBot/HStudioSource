const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { isValidURL } = require("../../utils/url");
const { isYouTubeUrl } = require("../../utils/youtube");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("converter")
        .setDescription("Converter")
        .setDescriptionLocalizations({
            th: "ตัวแปลง"
        })
        .addSubcommand(sub => sub
            .setName("youtube-url")
            .setDescription("Convert Youtube Url to HStudio Play Url")
            .setDescriptionLocalizations({
                th: "แปลงลิ้งค์ Youtube เป็นลิ้งค์ HStudio Play"
            })
            .addStringOption(option => option
                .setName("url")
                .setDescription("Youtube Url")
                .setDescriptionLocalizations({
                    th: "ลิ้งค์ Youtube"
                })
                .setRequired(true)
            )
        ),

    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, locale) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "youtube-url": {
                const url = interaction.options.getString("url");

                if (!isValidURL(url)) return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle(locale.getLocaleString("command.converter.youtube-url.notUrl"))
                            .setDescription(`\`\`\`${url}\`\`\``)
                    ]
                });

                if (!isYouTubeUrl(url)) return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle(locale.getLocaleString("command.converter.youtube-url.notYoutubeUrl"))
                            .setDescription(`\`\`\`${url}\`\`\``)
                    ]
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setTitle(locale.getLocaleString("command.converter.youtube-url.success"))
                            .setDescription(`\`\`\`${url.replace("www.youtube.com", "play.hstudio.hewkawar.xyz").replace("youtu.be", "play.hstudio.hewkawar.xyz")}\`\`\``)
                    ]
                });
                break;
            }
        }
    }
};