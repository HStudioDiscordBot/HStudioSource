const { Events, Client, ActivityType } = require("discord.js");
const { version } = require("../package.json");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * 
    * @param {Client} client - The Discord client.
    */
    async execute(client) {
        function setActivity() {
            client.user.setPresence({ activities: [{ name: `/help | V${version}`, type: ActivityType.Listening }]});
        }

        setActivity();

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server Count: ${client.guilds.cache.size}`);

        setInterval(setActivity, 60 * 1000);
    }
}