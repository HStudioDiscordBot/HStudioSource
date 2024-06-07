const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, Colors } = require("discord.js");
const { convertToHHMMSS, msToSec } = require("../../utils/time");
const { isYouTubeUrl, isHStudioPlayUrl } = require("../../utils/youtube");
const Locale = require("../../class/Locale");

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
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {Locale} locale 
     */
    async execute(interaction, client, locale) {
        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle(locale.getLocaleString("command.play.userNotInVoiceChannel"))] })

        let query = interaction.options.getString("query");

        let player = client.moon.players.create({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            autoLeave: true
        });

        if (isYouTubeUrl(query)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(locale.getLocaleString("command.play.youtube.disabled"))
                        .setDescription(locale.getLocaleString("command.play.youtube.disabled.discription"))
                ]
            });
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
            source: "spsearch",
            requester: interaction.user.id
        });

        if (res.loadType === "loadfailed") {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(locale.getLocaleString("command.play.loadFail"))
                ]
            });
        } else if (res.loadType === "empty") {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(locale.getLocaleString("command.play.notfound"))
                ]
            });
        }

        if (res.loadType === "playlist") {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setTitle(`▶️ ${res.playlistInfo.name}`)
                        .addFields(
                            { name: locale.getLocaleString("command.play.duration"), value: `\`\`\`${convertToHHMMSS(msToSec(res.playlistInfo.duration))}\`\`\``, inline: true },
                            { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                            { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                        )
                ]
            });

            for (const track of res.tracks) {
                player.queue.add(track);
            }
        } else {
            player.queue.add(res.tracks[0]);

            if (res.tracks[0].sourceName == "spotify") {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setAuthor({ name: res.tracks[0].author, iconURL: "https://cdn.jsdelivr.net/gh/HStudioDiscordBot/Storage@main/3rd/spotify-icon.png" })
                            .setTitle(`▶️ ${res.tracks[0].title}`)
                            .setURL(res.tracks[0].url)
                            .setThumbnail(res.tracks[0].artworkUrl)
                            .addFields(
                                { name: locale.getLocaleString("command.play.duration"), value: `\`\`\`${res.tracks[0].isStream ? "LIVE" : convertToHHMMSS(msToSec(res.tracks[0].duration))}\`\`\``, inline: true },
                                { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                                { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                            )
                    ]
                });
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setAuthor({ name: res.tracks[0].author })
                            .setTitle(`▶️ ${res.tracks[0].title}`)
                            .setThumbnail(res.tracks[0].artworkUrl)
                            .addFields(
                                { name: locale.getLocaleString("command.play.duration"), value: `\`\`\`${res.tracks[0].isStream ? "LIVE" : convertToHHMMSS(msToSec(res.tracks[0].duration))}\`\`\``, inline: true },
                                { name: locale.getLocaleString("command.play.voiceChannel"), value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                                { name: locale.getLocaleString("command.play.owner"), value: `<@${interaction.user.id}>`, inline: true }
                            )
                    ]
                });
            }

        }

        if (!player.playing) {
            player.play();
        }
    }
}