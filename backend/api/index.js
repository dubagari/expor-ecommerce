import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../config/db.js";
import path from "path";

// Routes Imports
import adminRoutes from "../routes/admin.routes.js";
import productRoutes from "../routes/product.routes.js";
import orderRoutes from "../routes/order.routes.js";
import userRoutes from "../routes/user.routes.js";
import reviewRoutes from "../routes/review.routes.js";
import cartRoutes from "../routes/cart.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Request Logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Database Connection
connectDB();

// Test Route
app.get("/api/test", (req, res) => res.json({ message: "API is working!" }));

// API Endpoints
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Main error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;


