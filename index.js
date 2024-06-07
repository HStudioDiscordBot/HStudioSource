const { ShardingManager } = require("discord.js");
const express = require("express");
const cors = require("cors");

const { version } = require("./package.json");

require('dotenv').config();

const maxServersPerShard = 10;

// Function to determine the number of shards needed
async function determineShardCount() {
    const response = await manager.fetchClientValues('guilds.cache.size');
    const totalServers = response.reduce((acc, guildCount) => acc + guildCount, 0);
    return Math.ceil(totalServers / maxServersPerShard);
}

// Sharding Manager
const manager = new ShardingManager("bot.js", {
    token: process.env.TOKEN,
    totalShards: 'auto',
});

manager.on('shardCreate', shard => {
    shard.on('death', () => {
        console.log(`[${shard.id}] is Death`);
        console.log(`[${shard.id}] Reswawning...`);
    });
    console.log(`Launched shard ${shard.id}`);
});

// Adjust shard count based on server limits
determineShardCount().then(shardCount => {
    manager.totalShards = shardCount;

    manager.spawn().then(shards => {
        shards.forEach(shard => {
            shard.on('message', message => {
                console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
            });
        });
    }).catch(console.error);
}).catch(console.error);


// API Manager
const api = express();
api.use(cors());
api.use(express.json());

api.get("/status", async (req, res) => {
    const status = {
        version: version,
        totalShards: manager.totalShards
    }

    status.shards = [];

    manager.shards.forEach(shard => {
        status.shards.push({
            id: shard.id,
            online: shard.ready,
        });
    });

    return res.status(200).json(status);
});

api.listen(8233, () => {
    console.log(`Status page server is running at http://localhost:8233/status`);
});