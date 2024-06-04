const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const lang = require('../../lang.json');
const { convertToHHMMSS, msToSec } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(lang.default.commands.play.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.play.description,
        })
        .addStringOption(option =>
            option.setName('query')
                .setDescription(lang.default.commands.play.StringOption.query.description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands.play.StringOption.query.description,
                })),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');

        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning: คุณต้องอยู่ใน Voice Channel ก่อนเชิญบอท`).setColor(Colors.Yellow)] });

        let player = client.moon.players.create({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            autoLeave: true
        });

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
                        .setTitle(`:x: โหลดไม่สำเร็จ ปัญหาภายในระบบ`)
                ]
            });
        } else if (res.loadType === "empty") {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setTitle(`:x: ไม่พบเพลง`)
                ]
            });
        }

        if (res.loadType === "playlist") {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setAuthor({ name: res.playlistInfo.author, iconURL: sourceIcon })
                        .setTitle(`:arrow_double_down: ┃ **${res.playlistInfo.name}** \`${res.playlistInfo.totalTracks} เพลง\``)
                        .setURL(res.playlistInfo.url)
                        .setThumbnail(res.playlistInfo.artworkUrl)
                        .addFields(
                            { name: "จำนวนเพลง", value: `\`\`\`${res.playlistInfo.totalTracks}\`\`\``, inline: true },
                            { name: "ช่องเสียง", value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                            { name: "เพิ่มโดย", value: `<@${interaction.user.id}>`, inline: true }
                        )
                ]
            });

            for (const track of res.tracks) {
                player.queue.add(track);
            }
        } else {
            player.queue.add(res.tracks[0]);

            let sourceIcon;
            if (res.tracks[0].sourceName == "spotify") sourceIcon = "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png";

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setAuthor({ name: res.tracks[0].author, iconURL: sourceIcon })
                        .setTitle(`:arrow_double_down: ┃ **${res.tracks[0].title}** \`${convertToHHMMSS(msToSec(res.tracks[0].duration))}\``)
                        .setURL(res.tracks[0].url)
                        .setThumbnail(res.tracks[0].artworkUrl)
                        .addFields(
                            { name: "ช่องเสียง", value: `<#${interaction.member.voice.channel.id}>`, inline: true },
                            { name: "เพิ่มโดย", value: `<@${interaction.user.id}>`, inline: true }
                        )
                ]
            });
        }

        if (!player.playing) {
            player.play();
        }
    },
};