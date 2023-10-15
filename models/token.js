const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    value: {
        type: String,
        default: ""
    },
    is_active: {
        type: Boolean,
        default: true
    },
    user: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        default: "never"
    },
    max_ip: {
        type: Number,
        default: 1
    },
    max_hwid: {
        type: Number,
        default: 1
    },
    assigned_ips: {
        type: Array,
        default: []
    },
    assigned_hwids: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('token', schema);