const { Events, ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const { version } = require("../package.json");

const mongoDBUrl = process.env.MONGODB_URL;

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * 
    * @param {import("discord.js").Client} client - The Discord client.
    */
    async execute(client) {
        let currentStatus = 0;

        function setActivity() {
            const status = [
                `🌟 /help | V${version}`,
                `🎷 Playing in ${client.moon.players.cache.size} Servers`,
                "🎵 /play to play song",
            ];
            
            client.user.setActivity({
                name: status[currentStatus],
                type: ActivityType.Custom
            });

            if (currentStatus >= status.length - 1) {
                currentStatus = 0;
            } else {
                currentStatus++;
            }
        }

        setActivity();

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server Count: ${client.guilds.cache.size.toLocaleString()}`);

        setInterval(setActivity, 5 * 1000);

        if (mongoDBUrl) {
            await mongoose.connect(mongoDBUrl);

            console.log(`[${client.shard.ids}] Connected to MongoDB`);
        }
    }
};