const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const YoutubeDirectSchema = require("../../schemas/YoutubeDirect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Show profile information")
        .setDescriptionLocalizations({
            th: "แสดงข้อมูลโปรไฟล์"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply({
            content: locale.getLocaleString("command.profile.finding"),
        });

        const ytDirect = await YoutubeDirectSchema.findOne({
            userId: interaction.user.id
        });

        let YoutubeDirectField = {
            name: locale.getLocaleString("command.profile.ytDirect.false"),
            value: "",
            inline: true
        };

        if (!ytDirect) { // Not have Youtube Direct
            YoutubeDirectField.value = locale.getLocaleString("command.profile.ytDirect.notHave");
        } else if ((ytDirect.expireAt ? ytDirect.expireAt.getTime() < Date.now() : false) && !ytDirect.infinity) { // Youtube Direct expired
            YoutubeDirectField.value = locale.getLocaleString("command.profile.ytDirect.expired.value");
        } else { // Have Youtube Direct
            YoutubeDirectField.name = locale.getLocaleString("command.profile.ytDirect.true");
            YoutubeDirectField.value = locale.replacePlaceholders(locale.getLocaleString("command.profile.ytDirect.have.value"), [`${ ytDirect.infinity ? locale.getLocaleString("command.profile.ytDirect.infinity") : `<t:${parseInt(ytDirect.expireAt.getTime() / 1000)}:R>`}`]);
        }

        const user = interaction.user;

        await interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale.getLocaleString("command.profile.title"))
                .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.profile.description"), [user.username, user.displayName, user.id]))
                .addFields(YoutubeDirectField)
                .setThumbnail(user.displayAvatarURL({ extension: "png", size: 512 }))
                .setTimestamp()
            ]
        });
    }
};