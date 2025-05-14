// api/config/mongoose.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB successfully connected!");
  } catch (error) {
    console.error("Mongodb connection error:", error);
    process.exit(1);
  }
};
