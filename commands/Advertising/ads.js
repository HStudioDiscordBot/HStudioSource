const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require("discord.js");
const adsConfig = require("../../configs/ads.json");
const AdSchema = require("../../schemas/Ad");

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
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, locale) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "create": {
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
            case "enable": {

                const enableAdId = interaction.options.getString("ad_id");

                if (!enableAdId) return;

                await interaction.deferReply({ ephemeral: true });

                try {
                    let adsData = await AdSchema.findById(enableAdId);

                    if (!adsData) return await interaction.editReply({
                        content: locale.replacePlaceholders(locale.getLocaleString("command.ads.enable.notfound"), [enableAdId])
                    });

                    if (adsData.owner != interaction.user.id) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.enable.onlyownercanedit")
                    });

                    if (!adsData.verify) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.enable.adsnotverify")
                    });

                    if (adsData.activate) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.enable.alreadyactivate")
                    });

                    if (adsData.expireAt) {
                        await AdSchema.findByIdAndUpdate(enableAdId, {
                            activate: true
                        });
                    } else {
                        const expireAt = new Date();
                        expireAt.setDate(expireAt.getDate() + adsData.age);

                        await AdSchema.findByIdAndUpdate(enableAdId, {
                            activate: true,
                            expireAt: expireAt
                        });
                    }

                    adsData = await AdSchema.findById(enableAdId);

                    return await interaction.editReply({
                        content: locale.replacePlaceholders(locale.getLocaleString("command.ads.enable.reply"), [Math.round(new Date(adsData.expireAt).getTime() / 1000)])
                    });
                } catch (err) {
                    console.error(err);
                }
                break;
            }
            case "disable": {
                const disableAdId = interaction.options.getString("ad_id");

                if (!disableAdId) return;

                await interaction.deferReply({ ephemeral: true });

                try {
                    const adsData = await AdSchema.findById(disableAdId);

                    if (!adsData) return await interaction.editReply({
                        content: locale.replacePlaceholders(locale.getLocaleString("command.ads.disable.notfound"), [disableAdId])
                    });

                    if (adsData.owner != interaction.user.id) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.disable.onlyownercanedit")
                    });

                    if (!adsData.verify) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.disable.adsnotverify")
                    });

                    if (!adsData.activate) return await interaction.editReply({
                        content: locale.getLocaleString("command.ads.disable.alreadyinactivate")
                    });

                    await AdSchema.findByIdAndUpdate(disableAdId, {
                        activate: false
                    });

                    return await interaction.editReply({
                        content: locale.replacePlaceholders(locale.getLocaleString("command.ads.disable.reply"), [Math.round(new Date(adsData.expireAt).getTime() / 1000)])
                    });
                } catch (err) {
                    console.error(err);
                    await interaction.editReply({
                        content: locale.replacePlaceholders(locale.getLocaleString("command.ads.disable.error"), [disableAdId])
                    });
                }
                break;
            }
            case "list": {
                await interaction.deferReply({ ephemeral: true });

                const now = new Date();

                const adsList = await AdSchema.find({
                    owner: interaction.user.id,
                    expireAt: { $gt: now }
                });

                if (adsList.length == 0) return await interaction.editReply({
                    content: locale.getLocaleString("command.ads.list.notfound")
                });

                const adsText = adsList.map((row) => `- (${row.activate ? locale.getLocaleString("command.ads.list.activated") : locale.getLocaleString("command.ads.list.deactivated")}) ${row.verify ? "✅" : ""} ${row._id} ${row.expireAt ? `<t:${new Date(row.expireAt).getTime()}:F>` : "(ExpireAt not found)"}\n${row.description.length <= 50 ? row.description : row.description.substring(0, 50) + "..."}`).join("\n");

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setTitle(locale.getLocaleString("command.ads.list"))
                            .setDescription(adsText)
                    ]
                });
                break;
            }
        }
    }
};