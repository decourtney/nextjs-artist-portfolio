import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment the NodeJS global type
declare global {
  namespace NodeJS {
    interface Global {
      _mongoose?: MongooseCache;
    }
  }
}

async function dbConnect(): Promise<Mongoose> {
  // Type assertion for global
  const globalAny = global as typeof global & { _mongoose?: MongooseCache };

  let cached = globalAny._mongoose;

  if (!cached) {
    cached = { conn: null, promise: null };
    globalAny._mongoose = cached;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("DB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
