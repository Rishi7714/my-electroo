// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'https://placehold.co/300x200/cccccc/333333?text=No+Image'
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    // You could add reviews, ratings, etc. here
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
