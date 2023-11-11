const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const configFile = require('../config.json');
const token = require('../token.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        const commandNames = new Set();
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
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
            version: '10'
        }).setToken(token[configFile.appName]);

        (async () => {
            try {
                console.log(`[${client.shard.ids}] Started refreshing application (/) commands.`);

                const data = await rest.put(
                    Routes.applicationCommands(config.client_id), {
                        body: client.commandArray
                    },
                );

                console.log(`[${client.shard.ids}] Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};
