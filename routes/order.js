const router = require("express").Router();
const { AuthenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { sendOrderNotificationEmail, sendOrderConfirmationEmail } = require("../utils/emailService");

// place order ...
router.post("/order", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Order data is required" });
    }

    // Build order items with qty (matching the schema)
    const orderItems = order.map(item => ({
      book: item._id,
      qty: item.qty || 1
    }));

    // Calculate total amount
    const totalAmount = order.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    // Save order
    const newOrder = new Order({
      user: id,
      books: orderItems,
      totalAmount
    });

    const savedOrder = await newOrder.save();

    // Save order ref in user
    await User.findByIdAndUpdate(id, { $push: { orders: savedOrder._id } });

    // Clear cart (if stored inside user doc)
    await User.findByIdAndUpdate(id, { $set: { cart: [] } });

    // Fetch complete order details for email (with populated data)
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("books.book")
      .populate("user");

    // Send email notifications (non-blocking)
    const orderEmailDetails = {
      user: populatedOrder.user,
      books: populatedOrder.books,
      totalAmount: populatedOrder.totalAmount,
      orderId: savedOrder._id.toString(),
      orderDate: savedOrder.createdAt || new Date(),
    };

    // Send emails asynchronously (don't await - let it run in background)
    sendOrderNotificationEmail(orderEmailDetails).catch(err => 
      console.error("Admin email notification failed:", err)
    );
    sendOrderConfirmationEmail(orderEmailDetails).catch(err => 
      console.error("Customer confirmation email failed:", err)
    );

    return res.json({
      status: "success",
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({ message: "An error occurred..." });
  }
});

// get order history of a particular user...
router.get("/orders", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    
    if (!id) {
      return res.status(400).json({ message: "User ID not found" });
    }
    
    const orders = await Order.find({ user: id })
      .populate({
        path: "books.book",
        model: "book"
      })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    return res.json({
      status: "success",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "An error occurred while fetching orders",
      error: error.message
    });
  }
});

// Alternative route for backward compatibility
router.get("/get-order-history", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const userData =  await User.findById(id).populate({
      path: "orders",
      populate: { path: "books" },
    });

    const orderData = userData.orders.reverse();
    return res.json({
      status: "success",
      data: orderData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "an error occured...",
    });
  }
});

// get all orders --admin

router.get("/get-all-history", AuthenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "You do not have admin access" });
    }
    const userData = await Order.find()
      .populate({
        path: "books.book",
        model: "book",
      })
      .populate({
        path: "user",
        model: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "an error occured...",
    });
  }
});

// update order status -- admin
router.put('/update-status/:id', AuthenticateToken, async(req, res)=>{
  try{
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "You do not have admin access" });
    }
    const {id} = req.params;
    await Order.findByIdAndUpdate(id, {status: req.body.status});
    return res.json({
      status: "success",
      message : "status updated successfully..."
    })

  }
  catch(error){
    return res.status(500).json({
      message: "an error occured..."
    })
  }
})

// clear order history for a user
router.delete('/clear-history', AuthenticateToken, async(req, res)=>{
  try{
    const id = req.user.id;
    
    // Delete all orders for this user
    await Order.deleteMany({ user: id });
    
    // Clear orders array in User model
    await User.findByIdAndUpdate(id, {
      $set: { orders: [] },
    });

    return res.json({
      status: "success",
      message: "Order history cleared successfully"
    });

  }
  catch(error){
    return res.status(500).json({
      message: "An error occurred while clearing order history"
    })
  }
})

module.exports = router;
