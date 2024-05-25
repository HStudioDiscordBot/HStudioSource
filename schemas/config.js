const { Schema, model, Types } = require("mongoose");
const prefix = process.env.DATABASE_PREFIX;

const schema = new Schema({
    GuildId: String,
    Loop: Boolean,
    Speed: Types.Decimal128,
    Volume: Number
});

module.exports = model(`${prefix}_config`, schema);