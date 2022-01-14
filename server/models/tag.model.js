var mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamp: true
}) 

module.exports = mongoose.models.tag || mongoose.model('tag', tagSchema, "tag")