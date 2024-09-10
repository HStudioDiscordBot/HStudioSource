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

    await (async () => {
        try {

            console.log("📃 Commands Process");
            console.log("🔒 Started refreshing application (/) commands.");
            
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commandArray
            });

            console.log(`🔓 Successfully reloaded ${data.length} application (/) commands.`);

            console.log("\n");

            const commands = data.map(command => `🟢 /${command.name} Operational`);

            console.log(commands.join("\n"));
        } catch (error) {
            console.error(error);
        }
    })();
};