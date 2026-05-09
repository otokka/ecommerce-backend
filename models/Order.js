const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: String,
  userEmail: String,
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      image: String,
      size: String,
      qty: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: String,
  paymentId: String,
  address: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);