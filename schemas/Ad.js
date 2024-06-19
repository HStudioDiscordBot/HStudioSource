const { model, Schema } = require("mongoose");

module.exports = model("ad", new Schema({
    owner: String,
    description: String,
    imageUrl: String,
    buttonText: String,
    buttonUrl: String,
    age: Number,
    activate: Boolean,
    verify: Boolean,
    expireAt: Date
}, {
    timestamps: true
}));