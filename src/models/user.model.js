const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['CUSTOMER', 'SELLER', 'ADMIN'], 
    default: 'CUSTOMER' 
  },
  mobile: { type: String },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  sellerProfile: {
    storeName: String,
    storeDescription: String,
    onboardingStatus: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'APPROVED'],
      default: 'NOT_STARTED'
    }
  },
  address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'addresses',
  }],
  paymentInformation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment_information',
  }],
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ratings',
  }],
  reviews: [{   
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reviews',
  }]
}, {
  timestamps: true
});

const User = mongoose.model('users', userSchema);

module.exports = User;
