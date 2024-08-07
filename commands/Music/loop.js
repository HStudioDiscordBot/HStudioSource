const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Toggle On/Off loop")
        .setDescriptionLocalizations({
            th: "เปิดปิดลูป"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        if (!interaction.member.voice.channel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle(locale.getLocaleString("command.join.userNotInVoiceChannel"))] });

        let player = client.moon.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoLeave: true,
            autoPlay: true
        });

        if (!player.connected) {
            player.destroy();
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.loop.botNotInVoiceChannel"))
                ]
            });
        }

        if (!player.playing) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(locale.getLocaleString("command.loop.fail"))
                    .setColor(Colors.Yellow)
            ],
            ephemeral: true
        });

        if (player.loop == 0) {
            if (player.setLoop(1)) interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.getLocaleString("command.loop.on.success"))
                ]
            });
            else interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.loop.on.fail"))
                ]
            });
        } else if (player.loop == 1) {
            if (player.setLoop(0)) interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setDescription(locale.getLocaleString("command.loop.off.success"))
                ]
            });
            else interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(locale.getLocaleString("command.loop.off.fail"))
                ]
            });
        }
    }
};