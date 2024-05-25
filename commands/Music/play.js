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
                )),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');
        const platform = interaction.options.getString('platform');

        const requestedLocalization = lang[interaction.locale] || lang.default;

        if (!interaction.member.voice.channel) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:warning: ${requestedLocalization.commands.error.please_join_before_use_bot}`).setColor("Yellow")] });
        }

        const pl = utils.autoPlatfrom(query);

        if (pl === 'spotify') {
            const ac_token = await utils.makeAccessToken(interaction, spotify_client_id, spotify_client_secret);

            const spotify_id = utils.extractSpotifyTrackId(query);
            await utils.playSpotify(interaction, spotify_id, ac_token, requestedLocalization, client);
        } else if (pl === 'youtube') {
            const onriginal = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('<:youtube_mokey:1160524601026162758> Loading Video').setColor(Colors.Blue).setDescription('Wait a moment...').setImage('https://cdn.jsdelivr.net/gh/HStudioDiscordBot/HStudioSource@main/assets/banner/loading.png')] });
            await utils.playYoutube(interaction, query, requestedLocalization, onriginal, client);
        } else if (pl === 'search') {
            if (platform) {
                if (platform === 'spotify') {
                    const ac_token = await utils.makeAccessToken(interaction, spotify_client_id, spotify_client_secret);

                    const spotify_id = await utils.searchTracks(query, ac_token);
                    await utils.playSpotify(interaction, spotify_id, ac_token, requestedLocalization, client);
                } else if (platform === 'youtube') {
                    const onriginal = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('<:youtube_mokey:1160524601026162758> Loading Video').setColor(Colors.Blue).setDescription('Wait a moment...').setImage('https://cdn.jsdelivr.net/gh/HStudioDiscordBot/HStudioSource@main/assets/banner/loading.png')] });
                    const searchResults = await ytsr(query);
                    await utils.playYoutube(interaction, searchResults.items[0].url, requestedLocalization, onriginal, client);
                }
            } else {
                const ac_token = await utils.makeAccessToken(interaction, spotify_client_id, spotify_client_secret);

                const spotify_id = await utils.searchTracks(query, ac_token);
                await utils.playSpotify(interaction, spotify_id, ac_token, requestedLocalization, client);
            }
        } else {
            return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`:no_entry: ${requestedLocalization.error.cant_procress_query}`).setColor('Red').setDescription(`\`\`\`${query}\`\`\``)] });
        }

    },
};