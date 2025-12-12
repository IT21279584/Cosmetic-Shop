require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/config/database");

// Initialize database connection with caching
let isConnected = false;

const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ Database initialized for serverless");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      isConnected = false;
    }
  }
};

// Export handler for Vercel serverless functions
module.exports = async (req, res) => {
  try {
    // Ensure database is connected before handling requests
    await initializeDB();

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error("Request handler error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
