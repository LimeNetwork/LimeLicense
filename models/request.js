const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    value: {
        type: String,
        default: ""
    },
    authorized: {
        type: Boolean,
        default: true
    },
    ip: {
        type: String,
        required: true
    },
    hwid: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('request', schema);