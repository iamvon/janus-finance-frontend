const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TokenSchema = new Schema(
    {
        chainId: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            unique: true,
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
        decimals: {
            type: Number
        },
        logoURI: {
            type: String,
            default: ""
        },
        tag: {
            type: [String],
            index: true,
            default: []
        },
        extensions: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
)

const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);

module.exports = Token;
