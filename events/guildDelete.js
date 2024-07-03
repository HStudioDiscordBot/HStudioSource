const { Events, EmbedBuilder, Colors } = require("discord.js");

const logChannel = process.env.GUILD_LOG;

module.exports = {
    name: Events.GuildDelete,
    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @param {import("discord.js").Client} client 
     */
    async execute(guild, client) {
        if (!logChannel) return;

        await client.channels.cache.get(logChannel).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`${client.user.tag} removed from \`${guild.id}\` (${guild.name})\nAll guilds: ${client.guilds.cache.size}`)
            ]
        });
    }
};