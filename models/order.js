const mongoose = require('mongoose');

// Defining the order schema
const order = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  books: [
    {
      book: { type: mongoose.Types.ObjectId, ref: "book", required: true },
      qty: { type: Number, default: 1 }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["order placed", "out for delivery", "delivered", "cancelled"],
    default: "order placed",
  }
}, { timestamps: true });

module.exports = mongoose.model("order", order);
