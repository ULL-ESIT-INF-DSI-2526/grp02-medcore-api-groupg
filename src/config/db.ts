import mongoose from "mongoose";

/**
 * @function connectDB
 * Establece la conexión con MongoDB usando Mongoose.
 */
export async function connectDB(): Promise<void> {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medcore";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
