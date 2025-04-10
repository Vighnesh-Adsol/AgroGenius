import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const imageDetect = async (prompt, image) => {
    try {
        console.log("Starting imageDetect with prompt:", prompt?.substring(0, 50));
        
        if (!image && !prompt) {
            throw new Error('Either image or prompt is required');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let imageBuffer = null;
        if (image) {
            const base64Data = image.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
        }

        const result = await model.generateContent([
            prompt || "",
            imageBuffer ? {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: "image/jpeg"
                }
            } : null
        ].filter(Boolean));

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error in imageDetect:", error);
        throw error;
    }
};

