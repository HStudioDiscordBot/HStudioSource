const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, entersState, getVoiceConnection } = require('@discordjs/voice');
const axios = require('axios');
var SpotifyWebApi = require('spotify-web-api-node');
const { spotify_client_id, spotify_client_secret } = require('../../config.json');
const fs = require('fs');
const { createReadStream } = require('node:fs');
const Spotify = require('spotifydl-core').default
const lang = require('../../lang.json');

function isSpotifyTrackURL(str) {
    const urlPattern = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(str)) {
        return false;
    }

    const parsedUrl = new URL(str);
    const isSpotifyURL = parsedUrl.hostname === 'open.spotify.com' && parsedUrl.pathname.startsWith('/track/');
    const isSpotifyLink = parsedUrl.hostname === 'spotify.link';

    return isSpotifyURL || isSpotifyLink;
}


function isYoutubeTrackURL(str) {
    const urlPattern = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(str)) {
        return false;
    }

    const parsedUrl = new URL(str);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    if (
        (hostname === 'www.youtube.com' || hostname === 'youtube.com') &&
        pathname.startsWith('/watch')
    ) {
        return true;
    } else if (hostname === 'youtu.be' && pathname.length > 1) {
        return true;
    }

    return false;
}


function extractSpotifyTrackId(url) {
    const trackIdRegex = /\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(trackIdRegex);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}
async function makeAccessToken() {
    try {
        const response = await axios.post(apiUrl, postData, { headers });
        return response.data.access_token;
    } catch (error) {
        interaction.reply("Can't Call Spotify API");
        return null;
    }
}

async function searchTracks(q, access_token) {
    const searchAPIUrl = "https://api.spotify.com/v1/search";
    const queryParams = {
        q: q,
        type: "track",
        limit: 1
    };
    const config = {
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        params: queryParams
    };

    try {
        const response = await axios.get(searchAPIUrl, config);
        return String(response.data.tracks.items[0].id);
    } catch (error) {
        console.log("Can't Search");
        return null;
    }
}

async function getTracks(id, access_token) {
    const searchAPIUrl = "https://api.spotify.com/v1/tracks/" + id;
    const config = {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    };

    try {
        const response = await axios.get(searchAPIUrl, config);

        const redata = {
            id: response.data.album.id,
            images: response.data.album.images[0].url,
            name: response.data.name,
            url: response.data.external_urls.spotify,
            uri: response.data.uri,
            length: convertToHHMMSS(msToSec(response.data.duration_ms)),
            album: response.data.album.name,
            album_image: response.data.album.images[0].url,
            album_url: response.data.album.external_urls.spotify,
            artists: response.data.album.artists[0].name,
            artists_url: response.data.album.artists[0].external_urls.spotify,
            platfrom_icon: "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png"
        };
        return redata;
    } catch (error) {
        console.log("Can't Get");
        return null;
    }
}

function msToSec(milliseconds) {
    return Math.ceil(milliseconds / 1000);
}

function convertToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsFinal = remainingSeconds % 60;

    if (hours > 0) {
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSecondsFinal).padStart(2, '0')}`;
        return formattedTime;
    } else {
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecondsFinal).padStart(2, '0')}`;
        return formattedTime;
    }
}

async function joinVC(interaction) {
    let connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
        connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
    }

    await interaction.guild.members.me.edit({
        deaf: true,
        mute: false,
    });

    return connection
}

function autoPlatfrom(query) {
    if (isSpotifyTrackURL(query)) {
        return 'spotify'
    } else if (isYoutubeTrackURL(query)) {
        return 'youtube'
    } else {
        return 'search'
    }
}

async function dlSpotify(interaction, dlPath, getResults, emoji_name, emoji_id) {
    if (fs.existsSync(dlPath)) {
        return;
    }

    const spotify = new Spotify({
        clientId: '08e3e233af5b4c3dabae5869658f1d0f',
        clientSecret: '627ee9e3dac54262b20667936c48bb78',
    });

    const progressBar = ['⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜'];

    let currentProgress = 0;

    const updateProgressBar = async () => {
        await dlMessage.edit({
            embeds: [new EmbedBuilder().setColor('Green').setTitle(`<:${emoji_name}:${emoji_id}> Downloading for the first time.`).setDescription(progressBar[currentProgress])]
        });
        currentProgress++;
    };

    const dlMessage = await interaction.channel.send({
        embeds: [new EmbedBuilder().setColor('Green').setTitle(`<:${emoji_name}:${emoji_id}> Downloading for the first time.`).setDescription(progressBar[0])]
    });

    await Promise.all([
        spotify.downloadTrack(getResults.url, dlPath),
        (async () => {
            for (let i = 1; i < progressBar.length; i++) {
                await updateProgressBar();
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        })(),
    ]);

    await dlMessage.delete();
}

async function playMusic(interaction, dlPath, connection, player, platform, platform_emoji_id, song_name) {
    let resource = createAudioResource(createReadStream(dlPath));

    player.play(resource);

    interaction.channel.send({ contant: '@silent', embeds: [new EmbedBuilder().setColor('Green').setDescription(`<:${platform}:${platform_emoji_id}> Start playing **${song_name}**`)] });

    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
}

async function playSpotify(interaction, searchResults, ac_token, requestedLocalization) {
    spotifyApi.setAccessToken(ac_token);

    if (!searchResults) {
        return await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('Error')]})
    }

    const getResults = await getTracks(searchResults, ac_token);

    const cardEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: getResults.artists, url: getResults.artists_url, iconURL: getResults.platfrom_icon })
        .setTitle(`:arrow_double_down: ┃ **${getResults.name}** \`${getResults.length}\``)
        .setURL(getResults.url)
        .setThumbnail(getResults.images)
        .addFields(
            { name: requestedLocalization.commands_play_execute_album, value: `\`${getResults.album}\``, inline: true },
            { name: requestedLocalization.commands_play_execute_voice_chat, value: `<#${interaction.member.voice.channel.id}>`, inline: true },
            { name: requestedLocalization.commands_play_execute_owner, value: `<@${interaction.user.id}>`, inline: true }
        );

    await interaction.reply({ embeds: [cardEmbed] });

    let connection = await joinVC(interaction);

    const player = createAudioPlayer();

    const dlPath = `downloads/${getResults.id}.mp3`;

    await dlSpotify(interaction, dlPath, getResults, 'spotify', '1156557829486948413');

    await playMusic(interaction, dlPath, connection, player, 'spotify', '1156557829486948413', getResults.name);
}

const postData = {
    grant_type: 'client_credentials',
    client_id: spotify_client_id,
    client_secret: spotify_client_secret
};

const apiUrl = 'https://accounts.spotify.com/api/token';

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

var spotifyApi = new SpotifyWebApi({
    clientId: '08e3e233af5b4c3dabae5869658f1d0f',
    clientSecret: '627ee9e3dac54262b20667936c48bb78',
    redirectUri: 'https://hstudio.hewkawar.xyz/spotify/callback'
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(lang.default.commands_play_description)
        .setDescriptionLocalizations({
            th: lang.th.commands_play_description,
        })
        .addStringOption(option =>
            option.setName('query')
                .setDescription(lang.default.commands_play_query_description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands_play_query_description,
                }))

        .addStringOption(option =>
            option.setName('platform')
                .setDescription(lang.default.commands_play_platform_description)
                .setDescriptionLocalizations({
                    th: lang.th.commands_play_platform_description,
                })
                .setRequired(false)
                .addChoices(
                    { name: 'Spotify', value: 'spotify' },
                    { name: 'Youtube', value: 'youtube' },
                    { name: 'SoundCloud', value: 'soundcloud' },
                )),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');
        const platform = interaction.options.getString('platform');

        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (!interaction.member.voice.channel) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning:: ${requestedLocalization.commands_play_error_please_join_before_use_bot}`).setColor("Yellow")] });
        }

        const pl = autoPlatfrom(query);

        const ac_token = await makeAccessToken();

        if (pl === 'spotify') {
            const spotify_id = extractSpotifyTrackId(query);
            await playSpotify(interaction, spotify_id, ac_token, requestedLocalization);
        } else if (pl === 'youtube') {
            await playYoutube();
        } else if (pl === 'search') {
            const spotify_id = await searchTracks(query, ac_token);
            await playSpotify(interaction, spotify_id, ac_token, requestedLocalization);
        } else {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:no_entry:: ไม่สามารถประมวณผล query ได้`).setColor('Red').setDescription(`\`\`\`${query}\`\`\``)] });
        }     
    },
};