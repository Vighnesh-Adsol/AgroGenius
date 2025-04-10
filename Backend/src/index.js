import express from "express";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from 'cors'

import path from "path"


import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import {connectDB} from "./lib/db.js"
import {app, server} from "./lib/socket.js"
import cloudinaryRoutes from './routes/cloudinary.route.js'; 
import geminiRoute from './routes/gemini.route.js'; 
dotenv.config()


app.use(cors({

    origin:"http://localhost:5173",
    credentials: true
}
))
const PORT = process.env.PORT
const __dirname = path.resolve();

// Increase payload size limit to 1MB
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb', extended: true}));

app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/cloudinary", cloudinaryRoutes); 
app.use("/api/ai", geminiRoute);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../Frontend", "dist", "index.html"));
    });
}

server.listen(PORT, ()=>{
    console.log("Server is running on port: "+PORT);
    connectDB();
});