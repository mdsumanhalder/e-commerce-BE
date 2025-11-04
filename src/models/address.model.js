const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: Number, required: true },
  mobile: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  addressLine2: { type: String, required: false },
  
  
  country: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

const Address = mongoose.model("addresses", addressSchema);

module.exports = Address;