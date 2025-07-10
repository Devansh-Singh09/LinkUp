import express from 'express';
import"dotenv/config";
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected to:", mongoose.connection.name); // ← ADD THIS
});


const app = express();
const PORT=process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
  origin:"http://localhost:5173", // Adjust this to your frontend URL
  credentials:true, // Allow credentials (cookies, authorization headers, etc.)
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"));
    });
}else{  
    app.get("/",(req,res)=>{
        res.send("API is running...");
    });
}

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `);
    connectDB();
});