# HStudio - Discord Music Bot Project

## Step to install

```bash
# install dependencies
$ npm install
```

### Edit config before run Bot

```json
{
    "appName": "myBot",
    "spotify_client_id": "YOUR_SPOTIFY_CLIENT_ID",
    "spotify_client_secret": "YOUR_SPOTIFY_CLIENT_SECRET",
    "setting": {
        "generateDependencyReport": false
    },
    "app": {
        "myBot": {
            "client_id": "YOUR_BOT_CLIENT_ID",
            "color": "Blue",
            "inviteURL": "INVITE_BOT_URL",
            "port": 1550
        }
    }
}
```
> YOUR_SPOTIFY_CLIENT_ID is [Spotify Client ID](https://developer.spotify.com/documentation/web-api/concepts/apps)

> YOUR_SPOTIFY_CLIENT_SECRET is [Spotify Client Secret](https://developer.spotify.com/documentation/web-api/concepts/apps)

> YOUR_BOT_TOKEN is [Discord Bot Token](https://discord.com/developers/applications)

> YOUR_BOT_CLIENT_ID is [Discord Bot Client ID](https://discord.com/developers/applications)

> INVITE_BOT_URL is [URL for Invite Your Bot](https://discordapi.com/permissions.html)

```bash
# run Bot
$ node ./index.js
```