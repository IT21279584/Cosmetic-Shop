require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

// Connect to database (works for both local and Vercel)
connectDB();

// Only start server if NOT in Vercel serverless environment
if (process.env.VERCEL !== "1") {
  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
  });

  // Start server for local development
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║                                        ║
  ║   🌸 Cosmetic Shop API Server 🌸     ║
  ║                                        ║
  ║   Environment: ${process.env.NODE_ENV || "development"}               ║
  ║   Port: ${PORT}                            ║
  ║   URL: http://localhost:${PORT}          ║
  ║                                        ║
  ╚════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  });
} else {
  console.log("Running in Vercel serverless environment");
}

// Export the Express app for Vercel
module.exports = app;
