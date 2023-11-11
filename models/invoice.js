const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    customer: {
        type: String,
        required: true,
    },
    total: {
        type: Float32Array,
        required: true,
    },
    subtotal: {
        type: Float32Array,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('product', schema);