const { ShardingManager } = require('discord.js');
const express = require('express');
const fs = require('fs');
const configFile = require('./config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;

const downloadPath = 'downloads';
if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
    console.log('Folder created successfully.');
} else {
    console.log('Folder already exists.');
}

const app = express();

const manager = new ShardingManager('./bot.js', {
    token: config.token,
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

app.listen(config.port, () => {
    console.log(`Status page server is running at http://localhost:${config.port}/status`);
});

manager.spawn();
