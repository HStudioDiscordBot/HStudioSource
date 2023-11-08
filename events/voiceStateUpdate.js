const { EmbedBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const config = require('../config.json')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        config.AutoVoiceChat.forEach(async VoiceChat => {
            if (newState.channelId === VoiceChat.id) {
                let channelName = VoiceChat.title;
                const EveryoneAllowPermission = [];
                const EveryoneDenyPermission = [];

                if (VoiceChat.permission.everyone[0]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.ViewChannel);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.ViewChannel);
                }

                if (VoiceChat.permission.everyone[1]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Connect);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Connect);
                }

                if (VoiceChat.permission.everyone[2]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Speak);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Speak);
                }

                channelName = channelName.replace("%username%", newState.member.user.username)

                const voiceChannel = await newState.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: VoiceChat.category,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.Speak,
                            ]
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: EveryoneAllowPermission,
                            deny: EveryoneDenyPermission,
                        }
                    ]
                  });

                await newState.member.edit({ channel: voiceChannel });

                const interval = setInterval(async () => {
                    if (voiceChannel.members.size === 0) {
                      await voiceChannel.delete();
                      clearInterval(interval);
                    }
                  }, 2000);
            }
        })
    },
};