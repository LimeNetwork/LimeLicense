const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    discord_id: {
        type: String,
        required: true,
    },
    have_products: {
        type: Array,
        default: []
    },
    tokens: {
        type: Array,
        default: []
    },
    servers: {
        type: Array,
        default: []
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