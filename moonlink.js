const { EmbedBuilder, Colors } = require("discord.js");
const { Manager } = require("moonlink.js");
const { version } = require("./package.json");
const Locale = require("./class/Locale");
const LocaleSchema = require("./schemas/Locale");
const PlayingHistorySchema = require("./schemas/PlayingHistory");

/**
 * 
 * @param {string} userId 
 * @returns {Promise<import("./class/Locale")>}
 */
async function getLocale(userId) {
    let userLocale = "en-US";

    try {
        if (userId) {
            const data = await LocaleSchema.findOne({
                owner: userId
            });

            if (data && data.locale) userLocale = data.locale;
        }
    } catch (err) {
        console.error(err);
    }

    return new Locale(userLocale);
}

/**
 * Initializes MoonlinkManager for the given client.
 * @param {import("discord.js").Client} client - The Discord client.
 */
function initializationMoonlink(client) {
    const moon = new Manager({
        nodes: JSON.parse(process.env.NODES),
        options: {
            defaultPlatformSearch: "spsearch",
            sortTypeNode: "playingPlayers",
            clientName: `HStudio/${version}`
        },
        sendPayload: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(JSON.parse(payload));
        }
    });

    moon.on("nodeCreate", (node) => {
        console.log(`[${client.shard.ids}] "${node.identifier}" was connected.`);
    });

    moon.on("nodeClose", (node, code, reason) => {
        console.log(`[${client.shard.ids}] "${node.identifier}" (${code}) was closed with: ${reason}.`);
        console.log(`[${client.shard.ids}] "${node.identifier}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("nodeDestroy", (node) => {
        console.log(`[${client.shard.ids}] "${node.identifier}" was destroy.`);
        console.log(`[${client.shard.ids}] "${node.identifier}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("nodeError", (node, error) => {
        console.log(`[${client.shard.ids}] "${node.identifier}" have some error: ${error}`);
        console.log(`[${client.shard.ids}] "${node.identifier}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("trackStart", async (player, track) => {
        let sourceIcon = ":arrow_forward:";

        const locale = await getLocale(track.requestedBy);

        try {
            if (track.sourceName == "spotify") {
                sourceIcon = "<:spotify:1264178732739072020>";

                client.channels.cache
                    .get(player.textChannelId)
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Blue)
                                .setDescription(locale.replacePlaceholders(locale.getLocaleString("moonlink.trackStart.withUrl"), [sourceIcon, track.title, track.url]))
                        ]
                    });
            } else {
                client.channels.cache
                    .get(player.textChannelId)
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Blue)
                                .setDescription(locale.replacePlaceholders(locale.getLocaleString("moonlink.trackStart.withoutUrl"), [sourceIcon, track.title]))
                        ]
                    });
            }

            try {
                if (track.requestedBy && track.sourceName && track.title && track.url && client.user.id && player.guildId && player.voiceChannelId) {
                    await PlayingHistorySchema.create({
                        userId: track.requestedBy,
                        source: track.sourceName,
                        title: track.title,
                        url: track.url,
                        bot: client.user.id,
                        guildId: player.guildId,
                        channelId: player.voiceChannelId
                    });
                }
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    });

    moon.on("queueEnd", async (player, track) => {
        const locale = track && track.requestedBy ? await getLocale(track.requestedBy) : new Locale("en-US");

        try {
            client.channels.cache
                .get(player.textChannel)
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(locale.getLocaleString("moonlink.trackEnd"))
                    ]
                });
        } catch (err) {
            console.error(err);
        }

        player.destroy();
    });

    moon.on("playerDisconnect", async (player) => {
        player.destroy();
    });

    client.on("ready", () => {
        moon.init(client.user.id);
        if (process.env.ANALYTIC_CHANNEL_ID) Analytics(process.env.ANALYTIC_CHANNEL_ID);
    });

    client.on("raw", (data) => {
        moon.packetUpdate(data);
    });

    // Analytics
    async function Analytics(id) {
        const analyticsChannel = await client.channels.fetch(id);

        if (!analyticsChannel) return;

        try {
            moon.on("trackStart", (player, track) => {
                analyticsChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(`\`${player.guildId}\` (${track.sourceName == "spotify" ? "<:spotify:1264178732739072020>" : track.sourceName}) [${player.node.identifier}] Start playing **${track.title}** (${track.url})`)
                            .setTimestamp()
                    ]
                });
            });

            moon.on("playerCreated", async (guildId) => {
                const guild = await client.guilds.fetch(guildId);
                if (guild) {
                    analyticsChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription(`Created player in \`${guild.id}\` (${guild.name})`)
                                .setTimestamp()
                        ]
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    client.moon = moon;
}

module.exports = {
    initializationMoonlink
};