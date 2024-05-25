const { EmbedBuilder, AttachmentBuilder, Colors, WebhookClient } = require("discord.js");
const twApi = require('@opecgame/twapi')
const lang = require("../lang.json");
const configFile = require('../config.json');
const { version } = require('../package.json');
const { default: axios } = require("axios");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'bugreport') {
            const command = interaction.fields.getTextInputValue('command');
            const description = interaction.fields.getTextInputValue('description');

            const user_id = interaction.user.id;
            const member = interaction.member;
            const userDisplayName = interaction.user.username;
            const server_id = interaction.guild.id || 'No Server Provided';

            const channel = await client.channels.cache.get('1172812588447449098');

            const reportEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Report from ${userDisplayName}!`)
                .addFields({ name: "User ID", value: `${user_id}` })
                .addFields({ name: "Member", value: `${member}` })
                .addFields({ name: "Server ID", value: `${server_id}` })
                .addFields({ name: "Command Reported", value: `${command}` })
                .addFields({ name: "Reported Description", value: `${description}` })
                .setTimestamp()
                .setFooter({ text: `${client.user.displayName} | ${lang.default.commands.version}: ${version}` })

            await interaction.reply({ content: 'Your report has been Submitted', ephemeral: true });

            await channel.send({ embeds: [reportEmbed] });
        }

        if (interaction.customId === 'donate') {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Blue).setDescription('<a:loading:1172816904356896830> กำลังตรวจสอบ Url กรุณารอสักครู่')], ephemeral: true });

            const url = interaction.fields.getTextInputValue('url');
            const voucher_code = url.replace('https://gift.truemoney.com/campaign/?v=', '');

            const tw = await twApi(voucher_code, process.env.TRUEMONEY_PHONE_NUMBER);

            switch (tw.status.code) {
                case "SUCCESS":
                    const webhook = new WebhookClient({ url: process.env.DONATE_WEBHOOK_URL });
                    await webhook.send({ embeds: [
                        new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setDescription(`ขอบคุณคุณ ${tw.data.owner_profile.full_name} สำหรับ \`${tw.data.my_ticket.amount_baht}\` บาทที่บริจาคให้ HStudio Teams`)
                    ]});

                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Green).setDescription(`✅ ขอบคุณสำหรับ \`${tw.data.my_ticket.amount_baht}\` บาทที่บริจาคให้ HStudio Teams`)] });
                    break;
                case "CANNOT_GET_OWN_VOUCHER":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ไม่สามารถเปิดซองของตัวเองได้`)] });
                    break;
                case "TARGET_USER_NOT_FOUND":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ไม่มีซองนี้ในระบบ`)] });
                    break;
                case "INTERNAL_ERROR":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ไม่มีซองนี้ในระบบ หรือลิ้งค์ไม่ถูกต้อง`)] });
                    break;
                case "VOUCHER_OUT_OF_STOCK":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ มีคนรับซองไปแล้ว`)] });
                    break;
                case "VOUCHER_NOT_FOUND":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ไม่พบซองนี้ในระบบ`)] });
                    break;
                case "VOUCHER_EXPIRED":
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ซองของขวัญหมดอายุแล้ว`)] });
                    break;
                default:
                    await interaction.editReply({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(`❌ ไม่สามารถเปิดซองของขวัญได้`)] });
                    break;
            }
        }
    },
};