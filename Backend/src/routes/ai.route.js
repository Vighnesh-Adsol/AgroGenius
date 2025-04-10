import express from 'express';
import { generateAIResponse } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/generate', generateAIResponse);

export default router;