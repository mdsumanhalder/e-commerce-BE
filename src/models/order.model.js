const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orderItems',
            required: true,
        }
    ],
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
    },
    paymentDetails:{
        paymentMethod:{
            type: String,
        },
        transactionId: {
            type: String,
        },
        paymentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: 'PENDING',
        },
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    totalDiscountedPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discounte: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus:{
        type: String,
        required: true,
        enum: ['PENDING','PLACED','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'],
        default: 'PENDING',
    },
    statusHistory: [{
        status: String,
        changedAt: {
            type: Date,
            default: Date.now
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        note: String
    }],
    totalItem:{
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
