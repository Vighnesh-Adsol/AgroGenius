// filepath: /home/vighnesh/Desktop/Projects/HKT 2k25- Mahesh/project/Backend/src/routes/cloudinary.route.js
import express from 'express';
import { uploadImage } from '../controllers/cloudinary.controller.js';
import { upload } from '../middlerware/multer.middleware.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadImage);

export default router;