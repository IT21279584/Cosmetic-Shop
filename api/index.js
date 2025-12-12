require("dotenv").config({ path: "./server/.env" });
const app = require("../server/src/app");
const connectDB = require("../server/src/config/database");

// Serverless function handler for Vercel
module.exports = async (req, res) => {
  try {
    // Connect to database (uses cached connection)
    await connectDB();

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
