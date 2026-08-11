const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./conn/conn"); // MongoDB connection

// Import models to ensure they're registered before routes use them
require("./models/user");
require("./models/book");
require("./models/order");

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-store-two-sage.vercel.app",
  // "https://reader-paradise.netlify.app",
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

console.log("🌐 CORS Allowed Origins:", allowedOrigins);

// ✅ Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes (fixed paths)
const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

// ✅ Test route
app.get('/', (req, res) => {
  res.send('backend is running')
})

// ✅ Use routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// Start server for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
