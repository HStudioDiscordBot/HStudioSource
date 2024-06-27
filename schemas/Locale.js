const { model, Schema } = require("mongoose");

module.exports = model("locale", new Schema({
    owner: String,
    locale: String
}, {
    timestamps: true
}));