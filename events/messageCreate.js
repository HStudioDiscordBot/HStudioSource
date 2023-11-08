const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || message.guild === null) {
            return;
        }
        
        if (config.AnitBot.BlockChannels.includes(message.channel.id) && !config.AnitBot.AllowUserIds.includes(message.author.id)) {
            const user = await client.users.fetch(message.author.id);
        
            await message.delete();
            await user.send({ embeds: [new EmbedBuilder().setTitle(`⚠️ : Hey You Can't send Message in ${message.channel.name}`).setDescription(`${message.content}`).setColor('Yellow')]});
        }
    },
};