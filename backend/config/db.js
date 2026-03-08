import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log(`Using Database: ${conn.connection.name}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;