const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, Client } = require("discord.js");
const Locale = require("../../class/Locale");
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
            case "enable":
                const enableAdId = interaction.options.getString("ad_id");

                if (!enableAdId) return;

                await interaction.deferReply({ ephemeral: true });

                try {
                    const adsData = await AdSchema.findById(enableAdId);

                    if (!adsData) return await interaction.editReply({
                        content: `🔍 Not found ads with id \`${enableAdId}\``
                    });

                    if (adsData.owner != interaction.user.id) return await interaction.editReply({
                        content: "❌ You can edit ads config only your ads"
                    });

                    if (!adsData.verify) return await interaction.editReply({
                        content: "❌ Your ads is waiting for verify\nYou can activate ads after verified"
                    });

                    if (adsData.activate) return await interaction.editReply({
                        content: "✅ Your ads is already activated"
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

                    return await interaction.editReply({
                        content: `✅ Activated ads\nThis ads will expire at <t:${Math.round(Date.now(adsData.expireAt) / 1000)}:F>`
                    });
                } catch (err) { }
                break;
            case "disable":
                const disableAdId = interaction.options.getString("ad_id");

                if (!disableAdId) return;

                await interaction.deferReply({ ephemeral: true });

                try {
                    const adsData = await AdSchema.findById(disableAdId);

                    if (!adsData) return await interaction.editReply({
                        content: `🔍 Not found ads with id \`${disableAdId}\``
                    });

                    if (adsData.owner != interaction.user.id) return await interaction.editReply({
                        content: "❌ You can edit ads config only your ads"
                    });

                    if (!adsData.verify) return await interaction.editReply({
                        content: "❌ Your ads is waiting for verify\nYou can inactivated ads after verified"
                    });

                    if (!adsData.activate) return await interaction.editReply({
                        content: "✅ Your ads is already inactivated"
                    });

                    await AdSchema.findByIdAndUpdate(disableAdId, {
                        activate: false
                    });

                    return await interaction.editReply({
                        content: `✅ Inactivated ads\nWhile inactivated ads the expire date not change it will end in <t:${Math.round(Date.now(adsData.expireAt) / 1000)}:F>`
                    });
                } catch (err) { }
                break;
        }
    }
}