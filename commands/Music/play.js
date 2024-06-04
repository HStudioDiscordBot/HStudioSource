const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const ytsr = require('ytsr')
const lang = require('../../lang.json');
const utils = require('../../utils');

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(lang.default.commands.play.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.play.description,
        })
        .addStringOption(option =>
            option.setName('query')
                .setDescription(lang.default.commands.play.StringOption.query.description)
                .setRequired(true)
                .setDescriptionLocalizations({
                    th: lang.th.commands.play.StringOption.query.description,
                })),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');

        
    },
};