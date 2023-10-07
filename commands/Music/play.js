const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { spotify_client_id, spotify_client_secret } = require('../../config.json');
const lang = require('../../lang.json');
const configFile = require('../../config.json');
const config = configFile.app[configFile.appName] || configFile.app.debug;
const utils = require('../../utils');

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
                }))
        .addStringOption(option =>
            option.setName('platform')
                .setDescription(lang.default.commands.play.StringOption.platform.description)
                .setDescriptionLocalizations({
                    th: lang.th.commands.play.StringOption.platform.description,
                })
                .setRequired(false)
                .addChoices(
                    { name: 'Spotify', value: 'spotify' },
                    { name: 'Youtube', value: 'youtube' },
                    { name: 'SoundCloud', value: 'soundcloud' },
                )),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');
        const platform = interaction.options.getString('platform');

        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (!interaction.member.voice.channel) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning: ${requestedLocalization.commands.error.please_join_before_use_bot}`).setColor("Yellow")] });
        }

        const pl = utils.autoPlatfrom(query);

        const ac_token = await utils.makeAccessToken(interaction, spotify_client_id, spotify_client_secret);

        if (pl === 'spotify') {
            const spotify_id = utils.extractSpotifyTrackId(query);
            await utils.playSpotify(interaction, spotify_id, ac_token, requestedLocalization, config, spotify_client_id, spotify_client_secret);
        } else if (pl === 'youtube') {
            await utils.playYoutube(interaction, query, requestedLocalization, config);
        } else if (pl === 'search') {
            const spotify_id = await utils.searchTracks(query, ac_token);
            await utils.playSpotify(interaction, spotify_id, ac_token, requestedLocalization, config, spotify_client_id, spotify_client_secret);
        } else {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:no_entry:: ${requestedLocalization.error.cant_procress_query}`).setColor('Red').setDescription(`\`\`\`${query}\`\`\``)] });
        }
    },
};