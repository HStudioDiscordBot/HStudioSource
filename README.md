# HSudio Source Code
The Best Music Bot Create by @hewkawar

---
[![CodeFactor](https://www.codefactor.io/repository/github/hstudiodiscordbot/hstudiosource/badge)](https://www.codefactor.io/repository/github/hstudiodiscordbot/hstudiosource)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/HStudioDiscordBot/HStudioSource/build.yml)
![GitHub language count](https://img.shields.io/github/languages/count/HStudioDiscordBot/HStudioSource)
![GitHub License](https://img.shields.io/github/license/HStudioDiscordBot/HStudioSource)
![GitHub package.json prod dependency version](https://img.shields.io/github/package-json/dependency-version/HStudioDiscordBot/HStudioSource/moonlink.js)

## Step to install
Install Dependencies
```bash
$ npm install
```

## Environment (Env)
**[Discord Developer](https://discord.com/developers/applications)**
```
TOKEN= # Bot Token
CLIENT_ID= # Bot Client Id
```

**Truemoney Wallet Voucher**
```
TRUEMONEY_PHONE_NUMBER= # Donate: Truemoney Phone Number
DONATE_WEBHOOK_URL= # Donate: Discord Webhook
```

**[Lavalink](https://lavalink.dev/)**
```
LAVALINK_HOST= # Lavalink Host
LAVALINK_PORT= # Lavalink Port
LAVALINK_PASSWORD= # Lavalink Password
```

**Log**
```
ANALYTIC_CHANNEL_ID= Discord Channel to logs
```

**[MongoDB](https://www.mongodb.com/)**
```
MONGODB_URL= # MongoDB Url
```

**Config**
```
PORT=8233 # Status Port default 8233
```

## How to run Bot
### Docker

```bash
docker run -d --restart always \
    --name hstudio \
    -e TOKEN= \
    -e CLIENT_ID= \
    -e TRUEMONEY_PHONE_NUMBER= \
    -e DONATE_WEBHOOK_URL= \
    -e LAVALINK_HOST= \
    -e LAVALINK_PORT= \
    -e LAVALINK_PASSWORD= \
    -e ANALYTIC_CHANNEL_ID= \
    -e MONGODB_URL= \
    -e PORT=8233 \
    -p 8233:8233 \
    hewkawar/hstudio-bot:latest
```

### Source Code
```bash
$ git clone https://github.com/HStudioDiscordBot/HStudioSource.git
```

```bash
$ npm install
```

> Please config **.env** before run bot

```bash
$ npm run bot
```

# Translators
HStudio uses [Crowdin](https://crowdin.com/project/hstudiodiscordbot), the cloud-based localization management tool.

# Support
[Discord](https://discord.gg/gAdjmmHxBQ)
