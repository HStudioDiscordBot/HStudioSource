const { EmbedBuilder, Colors, Client } = require("discord.js");
const { MoonlinkManager } = require("moonlink.js");

/**
 * Initializes MoonlinkManager for the given client.
 * @param {Client} client - The Discord client.
 */

function initializationMoonlink(client) {
    client.moon = new MoonlinkManager([
        {
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT),
            password: process.env.LAVALINK_PASSWORD
        }
    ], {}, (guild, sPayload) => {
        client.guilds.cache.get(guild).shard.send(JSON.parse(sPayload));
    });

    client.moon.on("nodeCreate", node => {
        console.log(`[${client.shard.ids}] "${node.host}" was connected.`);
    });

    client.moon.on("trackStart", async (player, track) => {
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

    client.moon.on("queueEnd", async (player, track) => {
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

    client.moon.on("playerDisconnect", async (player) => {
        player.destroy();
    });

    client.on("ready", () => {
        client.moon.init(client.user.id);
    });

    client.on("raw", data => {
        client.moon.packetUpdate(data);
    });
}

module.exports = {
    initializationMoonlink
}