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
    },
    discount: {
        type: Float32Array,
        required: true,
    },
    products: {
        type: Array,
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('product', schema);