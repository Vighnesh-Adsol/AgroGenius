import express from 'express';
import { sendMessageAI } from '../controllers/gemini.controller.js';

const router = express.Router();

router.post('/generate', sendMessageAI); // Changed from '/ai' to '/generate' to match frontend

export default router;