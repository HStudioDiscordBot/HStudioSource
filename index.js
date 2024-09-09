const { ShardingManager } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const express = require("express");
const cors = require("cors");
const readline = require("readline");
const handleCommands = require("./utils/commands");

const package = require("./package.json");

require("dotenv").config();

(async () => {
    // Console Log
    console.log("\n");
    console.log("🤖 Bot is starting...");
    console.log(`📦 HStudioSource@${package.version}`);
    console.log(`🤖 Bot is running on version ${package.version}`);
    console.log("\n");

    // Register Bot Commands
    await handleCommands();

    // Sharding Manager
    const manager = new ShardingManager("bot.js", {
        token: process.env.TOKEN,
        totalShards: parseInt(process.env.SHARDS) || process.env.SHARDS || "auto"
    });

    manager.on("shardCreate", shard => {
        shard.on("death", () => {
            console.log(`[${shard.id}] is Death`);
            console.log(`[${shard.id}] Reswawning...`);
        });
        console.log(`🔎 Launched shard ${shard.id}`);
    });

    manager.spawn();

    // API Manager
    const port = process.env.PORT || 8233;

    const api = express();
    api.use(cors());
    api.use(express.json());

    const rest = new REST({
        version: "10"
    }).setToken(process.env.TOKEN);

    api.get("/invite", async (req, res) => {
        return res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}`);
    });

    api.get("/status", async (req, res) => {
        const shards = manager.shards.map((shard) => { return { id: shard.id, online: shard.ready }; });

        const status = {
            version: package.version,
            totalShards: manager.totalShards,
            shards: shards
        };

        return res.status(200).json(status);
    });

    api.get("/status/all", async (req, res) => {
        const shards = manager.shards.map((shard) => { return { id: shard.id, online: shard.ready }; });

        const guilds = await rest.get(Routes.userGuilds());
        const user = await rest.get(Routes.user());

        const guildsList = guilds.map((val) => val.id);

        const status = {
            name: user.username,
            version: package.version,
            totalShards: manager.totalShards,
            shards: shards,
            guilds: {
                total: guildsList.length,
                list: guildsList
            }
        };

        return res.status(200).json(status);
    });

    api.get("/guilds", async (req, res) => {
        let guildsList = [];
        let after = null;

        try {
            while (true) {
                const queryParams = after ? { after, limit: 200 } : { limit: 200 };
                const guilds = await rest.get(Routes.userGuilds(), { query: queryParams });

                if (guilds.length === 0) break;

                guildsList.push(...guilds.map((val) => val.id));

                if (guilds.length < 200) break;

                after = guilds[guilds.length - 1].id;
            };

            return res.status(200).json({
                total: guildsList.length,
                list: guildsList
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while fetching guilds" });
        }
    });

    api.listen(port, () => {
        console.log(`\n\n🚀 Status page server is running at http://localhost:${port}/status\n\n`);
    });

    // Handle Console Input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("line", async (input) => {
        const cmdCommand = input.trim().toLowerCase();

        switch (cmdCommand) {
            case 'offline': {
                console.log("🛑 Soft Offline all shards...");
                await manager.broadcast({ operation: "offline", value: true });
                console.log("✅ All shards soft offline successfully.");
                break;
            }
            case 'online': {
                console.log("🟢 Online all shards...");
                await manager.broadcast({ operation: "online", value: true });
                console.log("✅ All shards online successfully.");
                break;
            }
            case 'restart': {
                console.log("🔄 Restarting all shards...")
                try {
                    // Restart all shards
                    await manager.respawnAll();
                    console.log("✅ All shards restarted successfully.");
                } catch (error) {
                    console.error("❌ Error while restarting shards:", error);
                }
                break;
            }
            default: {
                console.log(`Unknown command: ${input}`);
                break;
            }
        }
    });
})();