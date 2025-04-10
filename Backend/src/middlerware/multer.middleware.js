// filepath: /home/vighnesh/Desktop/Projects/HKT 2k25- Mahesh/project/Backend/src/middlerware/multer.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });