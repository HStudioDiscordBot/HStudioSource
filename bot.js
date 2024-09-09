const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { initializationMoonlink } = require("./moonlink");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

initializationMoonlink(client);

client.commands = new Collection();
client.status = "online";

process.on("message", (message) => {
    if (message && message.operation) {
        if (message.operation == "offline") {
            client.status = "dnd";
        } else if (message.operation == "online") {
            client.status = "online";
        }
    }
});

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

(async () => {
    for (const file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login();
})();