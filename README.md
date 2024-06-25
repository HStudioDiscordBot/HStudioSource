# HStudio Source Code
The Best Music Bot created by @hewkawar

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
```
TOKEN= # Bot Token
CLIENT_ID= # Bot Client Id
```

**Truemoney Wallet Voucher**
```
TRUEMONEY_PHONE_NUMBER= # Donate: Truemoney Phone Number
DONATE_WEBHOOK_URL= # Donate: Discord Webhook
```

**Lavalink**

Configure your Lavalink nodes. More information [here](https://lavalink.dev/):
```
NODES='[{"host":"0.0.0.0","port":2333,"password":"password","secure":false}]' # Nodes Config
```

**Log**
```
ANALYTIC_CHANNEL_ID= Discord Channel to logs
```

**MongoDB**

Set your MongoDB connection URL. More information [here](https://www.mongodb.com/):

```
MONGODB_URL= # MongoDB Url
```

**Config**
```
PORT=8233 # Status Port default 8233
```

# Running the Bot
## Using Docker
Run the bot using Docker with the following command:

```bash
docker run -d --restart always \
    --name hstudio \
    -e TOKEN= \
    -e CLIENT_ID= \
    -e TRUEMONEY_PHONE_NUMBER= \
    -e DONATE_WEBHOOK_URL= \
    -e NODES='[{"host":"0.0.0.0","port":2333,"password":"password","secure":false}]' \
    -e ANALYTIC_CHANNEL_ID= \
    -e MONGODB_URL= \
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

# Translators
HStudio uses [Crowdin](https://crowdin.com/project/hstudiodiscordbot) for localization management.

# Support
For support, join our [Discord](https://discord.gg/gAdjmmHxBQ) server.