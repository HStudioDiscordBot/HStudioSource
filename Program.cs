using Discord;
using Discord.WebSocket;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HStudio
{
    internal class Program
    {
        private static DiscordSocketClient client;
        private static SocketGuild guild;

        public static async Task Main(string[] args)
        {
            client = new DiscordSocketClient(new DiscordSocketConfig
            {
                AlwaysDownloadUsers = true,
                GatewayIntents = GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.GuildVoiceStates
            });

            client.Log += OnLog;
            client.Ready += OnReady;

            string botToken = "BOT_TOKEN";
            if (string.IsNullOrEmpty(botToken))
            {
                Console.WriteLine("Bot token not found. Set the DISCORD_BOT_TOKEN environment variable.");
                return;
            }

            await client.LoginAsync(TokenType.Bot, botToken);
            await client.StartAsync();
            await client.SetStatusAsync(UserStatus.Online);
            await client.SetCustomStatusAsync("🌟 /help | V3.0.0");

            await Task.Delay(-1); // Keeps the bot running indefinitely
        }

        private static Task OnReady() {
            return Task.CompletedTask;
        }

        private static Task OnLog(LogMessage message)
        {
            Console.WriteLine($"Bot | {message}");
            return Task.CompletedTask;
        }
    }
}