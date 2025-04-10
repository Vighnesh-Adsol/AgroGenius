import { imageDetect } from '../lib/gemini.js';

export const generateAIResponse = async (req, res) => {
    try {
        const { prompt, image } = req.body;
        console.log('Received request:', { hasPrompt: !!prompt, hasImage: !!image });
        
        if (!prompt && !image) {
            return res.status(400).json({ error: "Please provide text or image" });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({ error: "API key configuration error" });
        }

        const aiResponse = await imageDetect(prompt || '', image);
        
        if (!aiResponse) {
            console.error('No response received from Gemini API');
            return res.status(500).json({ error: "No response from AI model" });
        }

        console.log('AI response generated successfully');
        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error in generateAIResponse:', error);
        return res.status(500).json({ 
            error: "Failed to process request",
            details: error.message || 'Unknown error occurred'
        });
    }
};