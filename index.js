const { ShardingManager } = require('discord.js');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const { version } = require('./package.json')
const configFile = require('./config.json');

const config = configFile.app[configFile.appName] || configFile.app.debug;

const downloadPath = 'downloads';
if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
}

const app = express();
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const accessToken = tokenParts[1];

    const validToken = 'HStudioTokenAdmin';

    if (accessToken !== validToken) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    next();
};

const manager = new ShardingManager('./bot.js', {
    token: config.token,
    totalShards: 3,
});

manager.on('shardCreate', shard => {
    shard.on('death', () => {
        console.log(`[${shard.id}] is Death`);
        console.log(`[${shard.id}] Reswawning...`)
    })
    console.log(`Launched shard ${shard.id}`);
});

app.get('/status', (req, res) => {
    const status = {
        version: version,
        totalShards: manager.totalShards
    };
    status.shards = [];
    manager.shards.forEach(shard => {
        status.shards.push({
            id: shard.id,
            online: shard.ready,
        });
    });
    res.json(status);
});

app.post('/bot/respawn', authenticateToken, (req, res) => {
    if (req.body.shard === 'all') {
        manager.respawnAll();
        return res.status(201).json({ status: 201, message: 'Respawning All shard' });
    }

    manager.shards.forEach(shard => {
        if (shard.id === req.body.shard) {
            shard.respawn();
            return res.status(201).json({ status: 201, message: `Respawning shard ${shard.id}` });
        }
    });

    return res.status(500).json({ status: 500, message: `can't respawn shard` });
})

app.listen(config.port, () => {
    console.log(`Status page server is running at http://localhost:${config.port}/status`);
});

manager.spawn().then(shards => {
    shards.forEach(shard => {
        shard.on('message', message => {
            console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
        });
    });
})
    .catch(console.error);