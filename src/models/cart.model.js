const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  cartItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cartItems',
    default: [],
  }],
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalItem:{
    type: Number,
    default: 0,
  },
  totalDiscountedPrice: {
    type: Number,
    default: 0,
  },
  discounte:{
    type: Number,
    default: 0,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;      
