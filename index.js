const { ShardingManager } = require("discord.js");
const express = require("express");
const cors = require("cors");

const { version } = require("./package.json");

require('dotenv').config();

// Sharding Manager
const manager = new ShardingManager("bot.js", {
    token: process.env.TOKEN
});

manager.on('shardCreate', shard => {
    shard.on('death', () => {
        console.log(`[${shard.id}] is Death`);
        console.log(`[${shard.id}] Reswawning...`)
    })
    console.log(`Launched shard ${shard.id}`);
});

manager.spawn().then(shards => {
    shards.forEach(shard => {
        shard.on('message', message => {
            console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
        });
    });
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