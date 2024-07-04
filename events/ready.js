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
        function setActivity() {
            client.user.setActivity({
                name: `/help | ${client.guilds.cache.size.toLocaleString()} servers | V${version}`,
                type: ActivityType.Custom
            });
        }

        setActivity();

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server Count: ${client.guilds.cache.size.toLocaleString()}`);

        setInterval(setActivity, 60 * 1000);

        if (mongoDBUrl) {
            await mongoose.connect(mongoDBUrl);

            console.log(`[${client.shard.ids}] Connected to MongoDB`);
        }
    }
};