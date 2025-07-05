
import mongoose from "mongoose";

let isConnected = false; 

export const runDB = async () => {
  const connectionUrl = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!connectionUrl || !dbName) {
    throw new Error("MongoDB connection URL is missing in environment variables or dbName is missing");
  }

  if (isConnected) {
    console.log(" MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(connectionUrl, {
      dbName: dbName, 
    });
    isConnected = true;
    console.log(" Successfully connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
