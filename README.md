# HSudio Source Code
The Best Music Bot Create by @hewkawar

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
PORT= # Port for Status Service
```

**[Spotify for Developers](https://developer.spotify.com/)**
```
SPOTIFY_CLIENT_ID= # Spotify Client Id
SPOTIFY_CLIENT_SECRET= # Spotify Client Secret
```

**[MongoDB](https://www.mongodb.com/)**
```
MONGODB_URI= # MongoDB Uri
DATABASE_PREFIX= # Database Prefix: release
```

**Truemoney Wallet Voucher**
```
TRUEMONEY_PHONE_NUMBER= # Donate: Truemoney Phone Number
DONATE_WEBHOOK_URL= # Donate: Discord Webhook
```

## How to run Bot
### Docker

```bash
docker run -d --restart always \
    --name hstudio \
    -e TOKEN= \
    -e CLIENT_ID= \
    -e PORT=1550 \
    -e SPOTIFY_CLIENT_ID= \
    -e SPOTIFY_CLIENT_SECRET= \
    -e TRUEMONEY_PHONE_NUMBER= \
    -e DONATE_WEBHOOK_URL= \
    -e MONGODB_URI= \
    -e DATABASE_PREFIX= \
    -p 1550:1550 \
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