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
    -e TRUEMONEY_PHONE_NUMBER= \
    -e DONATE_WEBHOOK_URL= \
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