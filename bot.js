const { Client, GatewayIntentBits, Collection, EmbedBuilder, Colors } = require("discord.js");
const { MoonlinkManager } = require("moonlink.js");
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

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
    if (track.sourceName == "spotify") sourceIcon = "<:spotify:1156557829486948413>";

    client.channels.cache
        .get(player.textChannel)
        .send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setDescription(`${sourceIcon} เริ่มเล่น **[${track.title}](${track.url})**`)
            ]
        });
});

client.moon.on("trackEnd", async (player, track) => {
    let sourceIcon = ":arrow_forward:";
    if (track.sourceName == "spotify") sourceIcon = "<:spotify:1156557829486948413>";

    client.channels.cache
        .get(player.textChannel)
        .send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.NotQuiteBlack)
                    .setDescription(`${sourceIcon} เล่น **[${track.title}](${track.url})** เสร็จแล้ว`)
            ]
        });
});

client.on("ready", () => {
    client.moon.init(client.user.id);
});

client.on("raw", data => {
    client.moon.packetUpdate(data);
});

client.commands = new Collection();

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login();
})();