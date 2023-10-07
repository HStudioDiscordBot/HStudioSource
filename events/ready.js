const discord = require("discord.js");
const { version } = require('../package.json')

function totalMembers(client) {
    let totalUsers = 0;
    client.shard.client.guilds.cache.forEach((guild) => {
        totalUsers += guild.memberCount;
    });
    return totalUsers
  }

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `HStudio V${version}`, type: discord.ActivityType.Listening }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server: ${client.shard.client.guilds.cache.size}`)
        console.log(`[${client.shard.ids}] User: ${totalMembers(client)}`)
    },
};