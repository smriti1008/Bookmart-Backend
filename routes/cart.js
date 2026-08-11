const express = require("express");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const User = require("../models/user");

// ✅ Get current user's cart
router.get("/cart", AuthenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.book"); // populate book details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Clean up corrupted cart items (items without book field)
    const validCartItems = user.cart.filter(item => item.book && item.book._id);
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }
    
    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add to cart (POST - creating a new cart item)
router.post("/cart", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    // Validate bookId format
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Clean up corrupted cart items (items without book field)
    const validCartItems = user.cart.filter(item => item.book && item.book._id);
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }


    const existingItem = user.cart.find(
      (item) => item.book && item.book.toString() === bookId
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      user.cart.push({ book: bookId, qty: 1 });
    }

    await user.save();

    res.status(201).json({ message: "Book added to cart successfully" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Update cart item quantity (PUT with book ID in URL)
router.put("/cart/:bookId", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { qty } = req.body;

    if (!bookId || qty < 1) {
      return res.status(400).json({ message: "Book ID and valid quantity required" });
    }

    // Validate bookId format
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(item => item.book && item.book.toString() === bookId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.qty = qty;
    await user.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Remove from cart
router.delete("/cart/:bookId", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.book && item.book.toString() !== bookId
    );

    await user.save();

    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Clear entire cart
router.delete("/cart/clear", AuthenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
