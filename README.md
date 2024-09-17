# HStudio Source Code

The best music bot created by @hewkawar

---

[![CodeFactor](https://www.codefactor.io/repository/github/hstudiodiscordbot/hstudiosource/badge)](https://www.codefactor.io/repository/github/hstudiodiscordbot/hstudiosource)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/HStudioDiscordBot/HStudioSource/build.yml)
![GitHub language count](https://img.shields.io/github/languages/count/HStudioDiscordBot/HStudioSource)
![GitHub License](https://img.shields.io/github/license/HStudioDiscordBot/HStudioSource)
![GitHub package.json prod dependency version](https://img.shields.io/github/package-json/dependency-version/HStudioDiscordBot/HStudioSource/moonlink.js)

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Bot](#running-the-bot)
  - [Using Docker](#using-docker)
  - [From Source Code](#from-source-code)
- [Translators](#translators)
- [Support](#support)

## Installation

First, install the necessary dependencies:

```bash
npm install
```

## Environment Variables

Configure the following environment variables before running the bot:

**Discord Developer**

Set up your bot token and client ID from the [Discord Developer Portal](https://discord.com/developers/applications):

```dotenv
# Discord bot token
TOKEN=your_discord_bot_token_here

# Discord client ID
CLIENT_ID=your_client_id_here
```

**TrueMoney Wallet Voucher**

```dotenv
# TrueMoney phone number
TRUEMONEY_PHONE_NUMBER=your_truemoney_phone_number_here
```

**Webhook**

```dotenv
# Webhook URLs
DONATE_WEBHOOK_URL=your_donate_webhook_url_here
ERROR_WEBHOOK_URL=your_error_webhook_url_here
```

**Lavalink**

Configure your Lavalink nodes. More information [here](https://lavalink.dev/):

```dotenv
# Nodes configuration
NODES='[{"identifier":"Local", "regions": ["My Home"], "host":"0.0.0.0","port":2333,"password":"your_lavalink_password","secure":false}]'
```

**Log**

```dotenv
# Analytics channel ID
ANALYTIC_CHANNEL_ID=your_analytic_channel_id_here

# Log channel ID
GUILD_LOG=your_guilds_log_channel_id_here
```

**Shards**
```dotenv
# Total Shards default "auto"
SHARDS=auto
```

**MongoDB**

Set your MongoDB connection URL. More information [here](https://www.mongodb.com/):

```dotenv
# MongoDB connection URL
MONGODB_URL=your_mongodb_url_here
```

**Config**

```dotenv
# Server port
PORT=8233
```

## Running the Bot

### Using Docker

Run the bot using Docker with the following command:

```bash
docker run -d --restart always \
    --name hstudio \
    -e TOKEN=your_discord_bot_token_here \
    -e CLIENT_ID=your_client_id_here \
    -e TRUEMONEY_PHONE_NUMBER=your_truemoney_phone_number_here \
    -e DONATE_WEBHOOK_URL=your_donate_webhook_url_here \
    -e NODES='[{"identifier":"Local", "regions": ["My Home"], "host":"0.0.0.0","port":2333,"password":"your_lavalink_password","secure":false}]' \
    -e ANALYTIC_CHANNEL_ID=your_analytic_channel_id_here \
    -e MONGODB_URL=your_mongodb_url_here \
    -e GUILD_LOG=your_log_channel_id_here \
    -e SHARDS=auto \
    -e PORT=8233 \
    -p 8233:8233 \
    hewkawar/hstudio-bot:latest
```

### From Source Code

Clone the repository and install the dependencies:

```bash
git clone https://github.com/HStudioDiscordBot/HStudioSource.git
cd HStudioSource
npm install
```

> Make sure to configure your `.env` file before running the bot:

```bash
npm run bot
```

## Translators

HStudio uses [Crowdin](https://crowdin.com/project/hstudiodiscordbot) for localization management.

## Support

For support, join our [Discord](https://discord.gg/gAdjmmHxBQ) server.