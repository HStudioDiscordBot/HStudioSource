const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause Current Track")
        .setDescriptionLocalizations({
            th: "หยุดชั่วคราว"
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
                        .setDescription(locale.getLocaleString("command.pause.notinvoicechannel"))
                ]
            });
        }

        if (!player.playing) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(locale.getLocaleString("command.pause.fail"))
                    .setColor(Colors.Yellow)
            ],
            ephemeral: true
        });

        if (player.pause()) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(locale.getLocaleString("command.pause.paused"))
                ]
            });
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(locale.getLocaleString("command.pause.alreadypaused"))
                ]
            });
        }
    }
};