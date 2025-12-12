const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Trust proxy - Important for Vercel
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration - Allow multiple origins for Vercel
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173", // Vite default
  // Add your Vercel frontend URL here
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Be permissive in production, or use: callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("/*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development" || process.env.VERCEL !== "1") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

if (process.env.VERCEL !== "1") {
  app.use("/api", apiLimiter);
} else {
  console.log("Rate limiting disabled in Vercel serverless environment");
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌸 Cosmetic Shop API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Database health check
app.get("/api/health/db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.status(state === 1 ? 200 : 503).json({
      success: state === 1,
      database: states[state],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      database: "error",
      error: error.message,
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Catch-all for non-API routes (for SPA routing)
app.use("/(.*)", (req, res) => {
  // Don't send 404 for non-API routes as they might be frontend routes
  if (!req.originalUrl.startsWith("/api")) {
    res.status(404).json({
      success: false,
      message: "Route not found. This is an API server.",
      suggestion: "Check if you meant to access an /api/* endpoint",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }
});

// Global error handler (must be last)
app.use(errorHandler);

// Export the app
module.exports = app;
