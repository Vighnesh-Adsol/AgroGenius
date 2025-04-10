// filepath: Backend/src/controllers/gemini.controller.js
import { imageDetect } from '../lib/gemini.js';
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const sendMessageAI = async (req, res) => {
    try {
        const { prompt, image } = req.body;
        
        if (!prompt && !image) {
            return res.status(400).json({ error: "Please provide text or image" });
        }

        // Get AI response
        const response = await imageDetect(prompt, image);
        
        if (!response) {
            return res.status(500).json({ error: "Failed to get AI response" });
        }

        res.status(200).json({ response });
    } catch (error) {
        console.error("Error in sendMessageAI:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};