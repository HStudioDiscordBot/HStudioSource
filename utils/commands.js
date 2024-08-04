const { Collection, REST } = require("discord.js");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

module.exports = async function () {
    const commandFolders = fs.readdirSync("./commands");
    const commands = new Collection();
    const commandArray = [];
    const commandNames = new Set();
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            const commandName = command.data.name;

            if (commandNames.has(commandName)) {
                console.error(`Duplicate command name found: ${commandName}`);
                continue;
            }

            commandNames.add(commandName);
            commands.set(commandName, command);
            commandArray.push(command.data.toJSON());
        }
    }

    const rest = new REST({
        version: "10"
    }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log("Started refreshing application (/) commands.");

            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commandArray
            });

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};