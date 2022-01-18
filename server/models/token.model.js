const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TokenSchema = new Schema(
    {
        cid: {
            type: String,
            index: true,
            default: ""
        },
        symbol: {
            type: String,
            index: true,
            default: ""
        },
        name: {
            type: String,
            index: true,
            default: ""
        },
        slug: {
            type: String,
            index: true,
            default: ""
        },
        tag: {
            type: [String],
            index: true,
            default: []
        },
        price: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)
const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);

module.exports = Token;
