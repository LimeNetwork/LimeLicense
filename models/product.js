const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Float32Array,
        required: true,
    },
    discountedPrice: {
        type: Float32Array,
        default: 0
    },
    discountActive: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 100
    },
}, { timestamps: true })

module.exports = mongoose.model('product', schema);