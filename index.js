const { ShardingManager } = require("discord.js");
const express = require("express");
const cors = require("cors");

const { version } = require("./package.json");

require('dotenv').config();

const TOKEN = process.env.TOKEN;
const MAX_SERVERS_PER_SHARD = 10;

async function getServerCount() {
    try {
        const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                "Authorization": `Bot ${TOKEN}`
            }
        });
        return await response.json().length;
    } catch (error) {
        console.error("Error fetching server count:", error);
        return 0;
    }
}

async function startSharding() {
    const serverCount = await getServerCount();
    const totalShards = Math.ceil(serverCount / MAX_SERVERS_PER_SHARD);

    // Sharding Manager
    const manager = new ShardingManager("bot.js", {
        token: TOKEN,
        totalShards: totalShards
    });

    manager.on('shardCreate', shard => {
        shard.on('death', () => {
            console.log(`[${shard.id}] is Death`);
            console.log(`[${shard.id}] Reswawning...`);
        });
        console.log(`Launched shard ${shard.id}`);
    });

    manager.spawn().then(shards => {
        shards.forEach(shard => {
            shard.on('message', message => {
                console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
            });
        });
    }).catch(console.error);
}

startSharding();

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