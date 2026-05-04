import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const dbconnect = () => {
  const url = process.env.MONGODB_URI;  
  mongoose.connect(url).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed", err));
};

export default dbconnect;
