const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, Client } = require("discord.js");
const Locale = require("../../class/Locale");
const adsConfig = require("../../configs/ads.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ads")
        .setDescription("Advertising")
        .setDescriptionLocalizations({
            th: "การโฆษณา"
        })
        .addSubcommand(sub => sub
            .setName("create")
            .setDescription("Create Advertising")
            .setDescriptionLocalizations({
                th: "สร้างการโฆษณา"
            })
        )
        .addSubcommand(sub => sub
            .setName("list")
            .setDescription("Advertising List")
            .setDescriptionLocalizations({
                th: "รายการโฆษณา"
            })
        )
        .addSubcommand(sub => sub
            .setName("delete")
            .setDescription("Delete Advertising")
            .setDescriptionLocalizations({
                th: "ลบการโฆษณา"
            })
            .addStringOption(option => option
                .setName("ad_id")
                .setDescription("Ads Id")
                .setDescriptionLocalizations({
                    th: "Id โฆษณา"
                })
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("disable")
            .setDescription("Disable Advertising")
            .setDescriptionLocalizations({
                th: "ปิดการใช้งานโฆษณา"
            })
            .addStringOption(option => option
                .setName("ad_id")
                .setDescription("Ads Id")
                .setDescriptionLocalizations({
                    th: "Id โฆษณา"
                })
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("enable")
            .setDescription("Enable Advertising")
            .setDescriptionLocalizations({
                th: "เปิดใช้งานโฆษณา"
            })
            .addStringOption(option => option
                .setName("ad_id")
                .setDescription("Ads Id")
                .setDescriptionLocalizations({
                    th: "Id โฆษณา"
                })
                .setRequired(true)
            )
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "create":
                const createAds = new ButtonBuilder()
                    .setCustomId("buttonCreateAds")
                    .setLabel(locale.getLocaleString("ads.create.button"))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("✏️");

                const createAdsRow = new ActionRowBuilder()
                    .addComponents(createAds);

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(locale.replacePlaceholders(locale.getLocaleString("command.ads.create.description"), [adsConfig.rate.amount, adsConfig.rate.day]))
                    ],
                    components: [createAdsRow]
                });
                break;
        }
    }
}