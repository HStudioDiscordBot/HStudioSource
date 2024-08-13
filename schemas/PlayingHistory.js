const { model, Schema } = require("mongoose");

module.exports = model("playing_history", new Schema({
    userId: String,
    source: String,
    title: String,
    url: String,
    bot: String,
    guildId: String,
    channelId: String
}, {
    timestamps: true
}));