import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log("Warning: MONGO_URI is not defined in environment variables");
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Don't exit the process, just log the error
        // process.exit(1); 
    };
};