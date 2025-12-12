require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

// Only run server if not in Vercel environment
if (process.env.VERCEL !== "1") {
  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
  });

  // Connect to database and start server
  const startServer = async () => {
    try {
      await connectDB();

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
          mongoose.connection.close();
        });
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
} else {
  console.log("Running in Vercel serverless environment");
}
