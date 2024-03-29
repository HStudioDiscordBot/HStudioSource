const { SlashCommandBuilder, EmbedBuilder, GuildForumThreadManager, ClientUser } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, entersState, getVoiceConnection } = require('@discordjs/voice');
const axios = require('axios');
const fs = require('fs');
const { createReadStream } = require('node:fs');
const Spotify = require('spotifydl-core').default;
const ytdl = require('ytdl-core');

// Time Converter
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

// Converter
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 100000) {
        return (num / 1000).toFixed(0) + 'k';
    } else if (num >= 10000) {
        return (num / 1000).toFixed(1) + 'k';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
    } else {
        return num.toString();
    }
}

// Spotify
async function makeAccessToken(interaction, spotify_client_id, spotify_client_secret) {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', { grant_type: 'client_credentials', client_id: spotify_client_id, client_secret: spotify_client_secret }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return response.data.access_token;
    } catch (error) {
        interaction.reply("Can't Call Spotify API");
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
            id: response.data.id,
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

// Youtube
async function getVideo(url) {
    const response = await ytdl.getBasicInfo(url);

    const videoDetails = response.videoDetails;

    let maxResolutionThumbnail = videoDetails.thumbnails[0];

    for (const thumbnail of videoDetails.thumbnails) {
        if (thumbnail.width > maxResolutionThumbnail.width || thumbnail.height > maxResolutionThumbnail.height) {
            maxResolutionThumbnail = thumbnail;
        }
    }

    let videoLengthFormat;
    if (videoDetails.isLiveContent) {
        videoLengthFormat = 'LIVE';
    } else {
        videoLengthFormat = convertToHHMMSS(videoDetails.lengthSeconds);
    }

    const redata = {
        id: videoDetails.videoId,
        images: maxResolutionThumbnail.url,
        name: videoDetails.title,
        url: videoDetails.video_url,
        length: videoLengthFormat,
        lengthSeconds: videoDetails.lengthSeconds,
        auther: videoDetails.author.name,
        artists_url: videoDetails.author.channel_url,
        view: formatNumber(videoDetails.viewCount),
        platfrom_icon: "https://www.youtube.com/s/desktop/7c155e84/img/favicon_144x144.png"
    };
    return redata;

}

// Downloader
async function dlSpotify(interaction, dlPath, getResults, emoji_name, emoji_id, requestedLocalization, spotify_client_id, spotify_client_secret, config) {
    if (fs.existsSync(dlPath)) {
        return;
    }

    const spotify = new Spotify({
        clientId: spotify_client_id,
        clientSecret: spotify_client_secret,
    });

    const progressBar = ['⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜'];

    let currentProgress = 0;

    const updateProgressBar = async () => {
        await dlMessage.edit({
            embeds: [new EmbedBuilder().setColor(config.color).setTitle(`<:${emoji_name}:${emoji_id}> ${requestedLocalization.commands.play.execute.download}`).setDescription(progressBar[currentProgress])]
        });
        currentProgress++;
    };

    const dlMessage = await interaction.channel.send({
        embeds: [new EmbedBuilder().setColor(config.color).setTitle(`<:${emoji_name}:${emoji_id}> ${requestedLocalization.commands.play.execute.download}`).setDescription(progressBar[0])]
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

async function stYoutuve(interaction, dlPath, getResults, emoji_name, emoji_id, requestedLocalization, config) {

}

async function dlYoutube(interaction, dlPath, getResults, emoji_name, emoji_id, requestedLocalization, config) {
    if (fs.existsSync(dlPath)) {
        return;
    }

    // ytstream(getResults.url, {
    //     quality: 'highestaudio',
    //     filter: 'audioonly',
    //     format: 'mp3',
    // }).stream.pipe(fs.createWriteStream(dlPath))

    // const stream = await ytstream.stream(getResults.url, {
    //     quality: 'high',
    //     type: 'audio',
    // });
    // stream.stream.pipe(fs.createWriteStream(dlPath));

    const progressBar = ['⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜', '🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜'];

    let currentProgress = 0;

    const updateProgressBar = async () => {
        await dlMessage.edit({
            embeds: [new EmbedBuilder().setColor(config.color).setTitle(`<:${emoji_name}:${emoji_id}> ${requestedLocalization.commands.play.execute.download}`).setDescription(progressBar[currentProgress])]
        });
        currentProgress++;
    };

    const dlMessage = await interaction.channel.send({
        embeds: [new EmbedBuilder().setColor(config.color).setTitle(`<:${emoji_name}:${emoji_id}> ${requestedLocalization.commands.play.execute.download}`).setDescription(progressBar[0])]
    });

    let updateEvery;
    if (getResults.lengthSeconds > 60 * 60) {
        updateEvery = 1000;
    } else if (getResults.lengthSeconds > 30 * 60) {
        updateEvery = 600;
    } else if (getResults.lengthSeconds > 10 * 60) {
        updateEvery = 500;
    } else if (getResults.lengthSeconds > 5 * 60) {
        updateEvery = 400;
    } else if (getResults.lengthSeconds > 1 * 60) {
        updateEvery = 300;
    } else {
        updateEvery = 100;
    }
    await Promise.all([
        ytdl(getResults.url, {
            quality: 'highestaudio',
            filter: 'audioonly',
            format: 'mp3',
        }).pipe(fs.createWriteStream(dlPath)),
        (async () => {
            for (let i = 1; i < progressBar.length; i++) {
                await updateProgressBar();
                await new Promise(resolve => setTimeout(resolve, updateEvery));
            }
        })(),
    ]);

    await dlMessage.delete();
}

// Music Bot Utils
function autoPlatfrom(query) {
    if (isSpotifyTrackURL(query)) {
        return 'spotify'
    } else if (isYoutubeTrackURL(query)) {
        return 'youtube'
    } else {
        return 'search'
    }
}

async function playMusic(interaction, dlPath, connection, player, platform, platform_emoji_id, song_name, requestedLocalization, config) {
    let resource = createAudioResource(createReadStream(dlPath));

    player.play(resource);

    await interaction.channel.send({ contant: '@silent', embeds: [new EmbedBuilder().setColor(config.color).setDescription(`<:${platform}:${platform_emoji_id}> ${requestedLocalization.commands.play.execute.start_playing} **${song_name}**`)] });

    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
}

async function playSpotify(interaction, searchResults, ac_token, requestedLocalization, config, spotify_client_id, spotify_client_secret) {
    if (!searchResults) {
        return await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('Error')] })
    }

    const getResults = await getTracks(searchResults, ac_token);

    const cardEmbed = new EmbedBuilder()
        .setColor(config.color)
        .setAuthor({ name: getResults.artists, url: getResults.artists_url, iconURL: getResults.platfrom_icon })
        .setTitle(`:arrow_double_down: ┃ **${getResults.name}** \`${getResults.length}\``)
        .setURL(getResults.url)
        .setThumbnail(getResults.images)
        .addFields(
            { name: requestedLocalization.commands.play.execute.album, value: `\`${getResults.album}\``, inline: true },
            { name: requestedLocalization.commands.play.execute.voice_chat, value: `<#${interaction.member.voice.channel.id}>`, inline: true },
            { name: requestedLocalization.commands.play.execute.owner, value: `<@${interaction.user.id}>`, inline: true }
        );

    await interaction.reply({ embeds: [cardEmbed] });

    let connection = await joinVC(interaction);

    const player = createAudioPlayer();

    const dlPath = `downloads/sp-${getResults.id}.mp3`;

    await dlSpotify(interaction, dlPath, getResults, 'spotify', '1156557829486948413', requestedLocalization, spotify_client_id, spotify_client_secret, config);

    await playMusic(interaction, dlPath, connection, player, 'spotify', '1156557829486948413', getResults.name, requestedLocalization, config);
}

async function playYoutube(interaction, searchResults, requestedLocalization, config, onriginalMessage) {
    if (!searchResults) {
        return await onriginalMessage.edit({ embeds: [new EmbedBuilder().setColor('Red').setTitle('Error')] })
    }

    const getResults = await getVideo(searchResults);

    const cardEmbed = new EmbedBuilder()
        .setColor(config.color)
        .setAuthor({ name: getResults.auther, url: getResults.artists_url, iconURL: getResults.platfrom_icon })
        .setTitle(`:arrow_double_down: ┃ **${getResults.name}** \`${getResults.length}\``)
        .setURL(getResults.url)
        .setThumbnail(getResults.images)
        .addFields(
            { name: requestedLocalization.commands.play.execute.view, value: `\`${getResults.view}\``, inline: true },
            { name: requestedLocalization.commands.play.execute.voice_chat, value: `<#${interaction.member.voice.channel.id}>`, inline: true },
            { name: requestedLocalization.commands.play.execute.owner, value: `<@${interaction.user.id}>`, inline: true }
        );

    await onriginalMessage.edit({ embeds: [cardEmbed], files: [], components: [] });

    let connection = await joinVC(interaction);

    const player = createAudioPlayer();

    const dlPath = `downloads/yt-${getResults.id}.mp3`;

    await dlYoutube(interaction, dlPath, getResults, 'youtube', '1156557113548624007', requestedLocalization, config);

    await playMusic(interaction, dlPath, connection, player, 'youtube', '1156557113548624007', getResults.name, requestedLocalization, config);


}
// Voice Channel
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

// Auto Select Platform
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
    } else if (
        (hostname === 'music.youtube.com' || hostname === 'www.music.youtube.com') &&
        pathname.startsWith('/watch')
    ) {
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

function extractYouTubeVideoId(url) {
    const videoIdRegex = /[?&]v=([a-zA-Z0-9_-]+)/;
    const match = url.match(videoIdRegex);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}


// Utils
async function clearConnection(client) {
    try {
        const guilds = await client.guilds.fetch();

        for (const guild of guilds.values()) {
            const connection = getVoiceConnection(guild.id);

            if (connection && !connection.dispatcher && !connection.dispatcher.speaking) {
                connection.destroy();
            }
        }
    } catch (error) {
        console.error("Error disconnecting from voice channels:", error);
    }
}


module.exports = {
    msToSec,
    convertToHHMMSS,
    getTracks,
    dlSpotify,
    autoPlatfrom,
    playSpotify,
    makeAccessToken,
    extractSpotifyTrackId,
    searchTracks,
    playYoutube,
    extractYouTubeVideoId,
    clearConnection,
}