const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    GuildId: String,
    Loop: Boolean,
    Speed: Types.Decimal128,
    Volume: Number
});

module.exports = model('config', schema);