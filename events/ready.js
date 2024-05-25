const { ActivityType } = require("discord.js");
const { version } = require('../package.json');
const { clearConnection } = require('../utils');
const { default: mongoose } = require("mongoose");
const mongodbUri = process.env.MONGODB_URI;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `/help | V${version}`, type: ActivityType.Listening }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);
        console.log(`[${client.shard.ids}] Server Count: ${client.guilds.cache.size}`);

        setInterval(() => {
            clearConnection(client);
        }, 10 * 60 * 1000);

        if (!mongodbUri) return;

        await mongoose.connect(mongodbUri);

        if (mongoose.connect) {
            console.log(`[${client.shard.ids}] ${client.user.tag} have connected to the database!`);
        } else {
            console.log(`[${client.shard.ids}] ${client.user.tag} cannot connect to the database right now...`);
        }
    },
};