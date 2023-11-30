const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    value: {
        type: String,
        required: true
    },
    authorized: {
        type: Boolean,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    hwid: {
        type: String,
        required: true
    },
    product: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('request', schema);