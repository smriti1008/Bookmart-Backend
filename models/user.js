const mongoose = require('mongoose');

const  user= new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  avatar:{
    type: String,
    default: "https://www.w3schools.com/howto/img_avatar.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  favourites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    }
  ],
  cart: [
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: 1,
    }
  }
],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("user", user);
