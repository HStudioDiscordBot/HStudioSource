const { EmbedBuilder, Colors, Client } = require("discord.js");
const { MoonlinkManager } = require("moonlink.js");

/**
 * Initializes MoonlinkManager for the given client.
 * @param {Client} client - The Discord client.
 */

function initializationMoonlink(client) {
    const moon = new MoonlinkManager([
        {
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT),
            password: process.env.LAVALINK_PASSWORD
        }
    ], {}, (guild, sPayload) => {
        client.guilds.cache.get(guild).shard.send(JSON.parse(sPayload));
    });


    moon.on("nodeCreate", (node) => {
        console.log(`[${client.shard.ids}] "${node.host}" was connected.`);
    });

    moon.on("nodeClose", (node, code, reason) => {
        console.log(`[${client.shard.ids}] "${node.host}" (${code}) was closed with: ${reason}.`);
        console.log(`[${client.shard.ids}] "${node.host}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("nodeDestroy", (node) => {
        console.log(`[${client.shard.ids}] "${node.host}" was destroy.`);
        console.log(`[${client.shard.ids}] "${node.host}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("nodeError", (node, error) => {
        console.log(`[${client.shard.ids}] "${node.host}" have some error: ${error}`);
        console.log(`[${client.shard.ids}] "${node.host}" try to reconnect...`);
        node.reconnect();
    });

    moon.on("trackStart", async (player, track) => {
        let sourceIcon = ":arrow_forward:";

        if (track.sourceName == "spotify") {
            sourceIcon = "<:spotify:1156557829486948413>";

            client.channels.cache
                .get(player.textChannel)
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(`${sourceIcon} Start playing **[${track.title}](${track.url})**`)
                    ]
                });
        } else {
            client.channels.cache
                .get(player.textChannel)
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(`${sourceIcon} Start playing **${track.title}**`)
                    ]
                });
        }
    });

    moon.on("queueEnd", async (player, track) => {
        client.channels.cache
            .get(player.textChannel)
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("There are no more tracks")
                ]
            });
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

        moon.on("trackStart", (player, track) => {
            analyticsChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(`\`${player.guildId}\` (${track.sourceName == "spotify" ? "<:spotify:1156557829486948413>" : track.sourceName}) Start playing **${track.title}** (${track.url})`)
                        .setTimestamp()
                ]
            })
        });

        moon.on("playerCreated", (guildId) => {
            analyticsChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(`Created player in \`${guildId}\``)
                        .setTimestamp()
                ]
            })
        });
    }

    client.moon = moon;
}

module.exports = {
    initializationMoonlink
}