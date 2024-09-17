const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nodes")
        .setDescription("Show nodes information")
        .setDescriptionLocalizations({
            th: "แสดงข้อมูลของโหนด"
        }),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("discord.js").Client} client 
     * @param {import("../../class/Locale")} locale 
     */
    async execute(interaction, client, locale) {
        const nodes = client.moon.nodes.cache;
        let nodeData = [];
        let online = [];

        function formatBytes(bytes) {
            if (bytes === 0) return "0 Bytes";

            const k = 1024;
            const sizes = [locale.getLocaleString("utils.size.bytes"), locale.getLocaleString("utils.size.kb"), locale.getLocaleString("utils.size.mb"), locale.getLocaleString("utils.size.gb"), locale.getLocaleString("utils.size.tb"), locale.getLocaleString("utils.size.pb"), locale.getLocaleString("utils.size.eb"), locale.getLocaleString("utils.size.zb"), locale.getLocaleString("utils.size.yb")];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
        }

        function convertUptime(milliseconds) {
            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);

            seconds = seconds % 60;
            minutes = minutes % 60;
            hours = hours % 24;

            let result = "";
            if (days > 0) result += `${days} ${days > 1 ? locale.getLocaleString("utils.time.days") : locale.getLocaleString("utils.time.day")}, `;
            if (hours > 0) result += `${hours} ${hours > 1 ? locale.getDefaultString("utils.time.hours") : locale.getLocaleString("utils.time.hour")}, `;
            if (minutes > 0) result += `${minutes} ${minutes > 1 ? locale.getLocaleString("utils.time.minutes") : locale.getLocaleString("utils.time.minute")}`;

            return result.trim().replace(/,$/, "");
        }

        nodes.forEach((node) => {
            if (node.connected) online.push(node);
            nodeData.push({
                ...node,
            });
        });

        const color = online.length < nodeData.length && online.length > 0 ? Colors.Yellow : online.length === nodeData.length ? Colors.Green : Colors.Red;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(locale.getLocaleString("command.nodes.title"))
                    .addFields(nodeData.map((node) => ({
                        name: `${node.connected ? "🟢" : "🔴"} ${node.identifier}`,
                        value: `\`\`\`${locale.replacePlaceholders(locale.getLocaleString("command.nodes.field"), [node.regions.join(", "), node.stats.players, node.stats.playingPlayers, formatBytes(node.stats.memory.used), (node.stats.cpu.systemLoad * 100).toFixed(2), convertUptime(node.stats.uptime)])}\`\`\``,
                        inline: true
                    })))
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL({ extension: "png" }))
            ]
        });
    }
};