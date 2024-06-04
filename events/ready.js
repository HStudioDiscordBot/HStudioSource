const { ActivityType } = require("discord.js");
const { version } = require('../package.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `/help | V${version}`, type: ActivityType.Listening }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server Count: ${client.guilds.cache.size}`);
    },
};