const { model, Schema } = require("mongoose");

module.exports = model("youtubeDirect", new Schema({
    userId: String,
}, {
    timestamps: true
}));