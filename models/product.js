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
    short_description: {
        type: String,
        default: ""
    },
    featured_image: {
        type: String,
        default: ""
    },
    images: {
        type: Array,
        default: []
    },
    price: {
        type: mongoose.Decimal128,
        required: true,
    },
    discountedPrice: {
        type: mongoose.Decimal128,
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