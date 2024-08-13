const { model, Schema } = require("mongoose");

module.exports = model("default_source", new Schema({
    userId: String,
    source: String
}, {
    timestamps: true
}));