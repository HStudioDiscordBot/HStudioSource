const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        const commandNames = new Set();
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                const commandName = command.data.name;

                if (commandNames.has(commandName)) {
                    console.error(`Duplicate command name found: ${commandName}`);
                    continue;
                }

                commandNames.add(commandName);
                client.commands.set(commandName, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: "10"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                const data = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID), {
                    query: new URLSearchParams({
                        with_localizations: true
                    })
                });

                client.commandsData = data;
            } catch (error) {
                console.error(error);
            }
        })();
    };
};