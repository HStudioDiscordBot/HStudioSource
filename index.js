const { ShardingManager, Shard, ShardClientUtil } = require('discord.js');
const { token, port } = require('./config.json');
const express = require('express');

const app = express();

const manager = new ShardingManager('./bot.js', {
    token: token,
    totalShards: 1,
});

manager.on('shardCreate', shard => {
    shard.on('death', () => {
        console.log(`[${shard.id}] is Death`);
        console.log(`[${shard.id}] Reswawning...`)
    })
    console.log(`Launched shard ${shard.id}`);
});

app.get('/status', (req, res) => {
    const status = {};
    manager.shards.forEach(shard => {
        status[shard.id] = {
            online: shard.ready,
        };
    });
    res.json(status);
});

app.listen(port, () => {
    console.log(`Status page server is running at http://localhost:${port}/status`);
});

manager.spawn();
