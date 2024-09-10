const { SlashCommandBuilder, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { convertToHHMMSS, msToSec } = require("../../utils/time");
const { isYouTubeUrl, isHStudioPlayUrl } = require("../../utils/youtube");
const AdsSchema = require("../../schemas/Ad");
const YoutubeDirectSchema = require("../../schemas/YoutubeDirect");
const DefaultSourceSchema = require("../../schemas/DefaultSource");

const sources = require("../../configs/sources.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play or add to queue")
        .setDescriptionLocalizations({
            th: "เล่นเพลง / เพิ่มคิว"
        })
        .addStringOption(option => option
            .setName("query")
            .setDescription("Search term or Url")
            .setDescriptionLocalizations({
                th: "ชื่อเพลง หรือ ลิ้งค์"
            })
            .setRequired(true)
        ),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle(locale.getLocaleString("command.play.userNotInVoiceChannel"))] });

        let query = interaction.options.getString("query");

        const user_source = await DefaultSourceSchema.findOne({
            userId: interaction.user.id
        });

        let player = client.moon.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoLeave: true,
            autoPlay: true
        });

        async function checkYoutubeDirect() {
            const ytDirect = await YoutubeDirectSchema.findOne({
                userId: interaction.user.id
            });

            const adsButton = new ButtonBuilder()
                .setURL("https://hstudio.hewkawar.xyz/store")
                .setLabel(locale.getLocaleString("youtube.direct.disable.button.text"))
                .setStyle(ButtonStyle.Link);

            const adsActionRow = new ActionRowBuilder()
                .addComponents(adsButton);

            if (!ytDirect) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(locale.getLocaleString("youtube.direct.disable.text"))
                            .setImage("https://cdn.jsdelivr.net/gh/HStudioDiscordBot/Storage@main/ads/HStudio.ads.youtube_direct_user.png")
                    ],
                    components: [
                        adsActionRow
                    ]
                });
                return false;
            } else if (ytDirect.expireAt ? ytDirect.expireAt.getTime() < Date.now() : false && !ytDirect.infinity) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(locale.getLocaleString("youtube.direct.disable.expired"))
                    ],
                    components: [
                        adsActionRow
                    ]
                });
                return false;
            } else {
                return true;
            }
        }

        if (isYouTubeUrl(query)) {
            if (!(await checkYoutubeDirect())) {
                return;
            }
        }

        if (user_source ? sources[user_source.source].require.includes("YOUTUBE_DIRECT") : false) {
            if (!(await checkYoutubeDirect())) {
                return;
            }
        }

        if (isHStudioPlayUrl(query)) {
            query = query.replace("play.hstudio.hewkawar.xyz", "www.youtube.com");
        }

        if (!player.connected) {
            player.connect({
                setDeaf: true,
                setMute: false
            });
        }

        let res = await client.moon.search({
            query,
            source: user_source ? sources[user_source.source].source : "spsearch",
            requester: interaction.user.id
        });

        const replyData = {
            embeds: [],
            components: []
        };

        if (res.loadType === "loadfailed") {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(locale.getLocaleString("command.play.loadFail"))
                ]
            });
        } else if (res.loadType === "empty") {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(locale.getLocaleString("command.play.notfound"))
                ]
            });
        }

        const trackEmbed = new EmbedBuilder()
            .setColor(Colors.Blue);

        if (res.loadType == "error") {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(locale.getLocaleString("command.play.notfound"))
                        .setDescription(`\`\`\`${res.data.message}\`\`\``)
                ]
            });
        } else if (res.loadType === "playlist") {
            trackEmbed.setTitle(`▶️ ${res.data.info.name}`)
                .addFields(
                    { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                    { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                );

            for (const track of res.tracks) {
                player.queue.add(track);
            }
        } else {
            player.queue.add(res.tracks[0]);

            if (res.tracks[0].sourceName == "spotify") {
                trackEmbed.setAuthor({ name: res.tracks[0].author, iconURL: "https://cdn.jsdelivr.net/gh/HStudioDiscordBot/Storage@main/3rd/spotify-icon.png" })
                    .setTitle(`▶️ ${res.tracks[0].title}`)
                    .setURL(res.tracks[0].url)
                    .setThumbnail(res.tracks[0].artworkUrl)
                    .addFields(
                        { name: locale.getLocaleString("command.play.duration"), value: `\`\`\`${res.tracks[0].isStream ? "LIVE" : convertToHHMMSS(msToSec(res.tracks[0].duration))}\`\`\``, inline: true },
                        { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                        { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                    );
            } else {
                trackEmbed.setAuthor({ name: res.tracks[0].author })
                    .setTitle(`▶️ ${res.tracks[0].title}`)
                    .setThumbnail(res.tracks[0].artworkUrl)
                    .addFields(
                        { name: locale.getLocaleString("command.play.duration"), value: `\`\`\`${res.tracks[0].isStream ? "LIVE" : convertToHHMMSS(msToSec(res.tracks[0].duration))}\`\`\``, inline: true },
                        { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                        { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                    );
            }
        }

        replyData.embeds.push(trackEmbed);

        const now = new Date();

        const ads = await AdsSchema.aggregate([
            { $match: { activate: true, verify: true, expireAt: { $gt: now } } },
            { $sample: { size: 1 } }
        ]);

        const ad = ads.length > 0 ? ads[0] : null;

        if (ad) {
            const adEmbed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(ad.description)
                .setImage(ad.imageUrl)
                .setFooter({
                    text: locale.getLocaleString("ads.footer")
                });

            const adsButton = new ButtonBuilder()
                .setURL(ad.buttonUrl)
                .setLabel(ad.buttonText)
                .setStyle(ButtonStyle.Link);

            const adsActionRow = new ActionRowBuilder()
                .addComponents(adsButton);

            replyData.embeds.push(adEmbed);
            replyData.components.push(adsActionRow);
        }

        await interaction.editReply(replyData);

        if (!player.playing) {
            player.play();
        }
    }
};