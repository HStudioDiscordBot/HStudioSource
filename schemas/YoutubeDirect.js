const { model, Schema } = require("mongoose");

module.exports = model("youtubeDirect", new Schema({
    userId: String,
    expireAt: {
        type: Date,
        required: false
    },
    infinity: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
}));