import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import aiRoutes from "./src/routes/ai.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});