const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { token, client_id } = require('../config.json');

const clientId = '1105873690022924450';
const guildId = '1038752900639358988'; 

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        const commandNames = new Set(); // Use a Set to store unique command names
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                const commandName = command.data.name;

                if (commandNames.has(commandName)) {
                    console.error(`Duplicate command name found: ${commandName}`);
                    continue; // Skip this command
                }

                commandNames.add(commandName); // Add the command name to the Set
                client.commands.set(commandName, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '10'
        }).setToken(token);

        (async () => {
            try {
                console.log(`[${client.shard.ids}] Started refreshing application (/) commands.`);

                const data = await rest.put(
                    Routes.applicationCommands(client_id), {
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
