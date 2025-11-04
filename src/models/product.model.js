const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    title:{
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    discountedPrice: {
        type: Number,
    },
    discountPersent: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    brand:{
        type: String,
    },
    color: {
        type: String,
    },
    sizes: [{
        name: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],
    imageUrl: {
        type: String    
    },
    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratings'
    }],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviews'
    }],
    numRatings: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});
const Product = mongoose.model('products', orderItemSchema);

module.exports = Product;