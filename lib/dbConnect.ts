import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: MongooseCache = { conn: null, promise: null };

async function dbConnect(retries = 3, delay = 1000) {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // If connection exists and is ready, return it
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  // Reset previous promise if connection failed
  if (cached.conn && cached.conn.readyState !== 1) {
    cached.promise = null;
  }

  // Create connection promise if not exists
  if (!cached.promise) {
    cached.promise = new Promise(async (resolve, reject) => {
      const opts = {
        bufferCommands: true, // Enable command buffering
        serverSelectionTimeoutMS: 5000, // 5 second server selection timeout
        socketTimeoutMS: 45000, // 45 second socket timeout
        maxPoolSize: 10, // Limit connection pool size
      };

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const connection = await mongoose.connect(MONGODB_URI, opts);

          // Setup connection event listeners
          connection.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
          });

          connection.connection.on("disconnected", () => {
            console.warn("Mongoose disconnected");
          });

          resolve(connection.connection);
          return;
        } catch (error) {
          console.warn(`Database connection attempt ${attempt} failed`, error);

          if (attempt === retries) {
            reject(error);
            return;
          }

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
