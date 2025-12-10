const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discountPersent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
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
            default: 0
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
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'],
        default: 'PENDING'
    },
    approvedAt: { type: Date },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    rejectionReason: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    approvalHistory: [{
        status: String,
        reason: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        changedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
