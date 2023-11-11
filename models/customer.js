const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    discord_id: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    servers: {
        type: Array,
        default: []
    },
    have_products: {
        type: Array,
        default: []
    },
    tokens: {
        type: Array,
        default: []
    },
    invoices: {
        type: Array,
        default: []
    },
    hwids: {
        type: Array,
        default: []
    },
    ips: {
        type: Array,
        default: []
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    is_banned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('customer', schema);

/*    

{
    server_name: "",
    server_ip: "",
    server_avg_players: "",
    server_category: ""
}

*/