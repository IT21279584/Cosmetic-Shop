const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return cached connection if exists
  if (cached.conn) {
    console.log("🔄 Using cached MongoDB connection");
    return cached.conn;
  }

  // Return pending connection promise if exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log("🔌 Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database Name: ${mongoose.connection.name}`);
        return mongoose;
      })
      .catch((error) => {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        cached.promise = null; // Reset on failure
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
