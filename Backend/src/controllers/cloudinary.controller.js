// filepath: /home/vighnesh/Desktop/Projects/HKT 2k25- Mahesh/project/Backend/src/controllers/cloudinary.controller.js
import cloudinary from '../lib/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    console.log("uploadImage controller called");
    const file = req.file;

    if (!file) {
      console.log("No file uploaded"); 
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("File received:", file); 
    const result = await cloudinary.uploader.upload(file.buffer.toString('base64'), {
      resource_type: 'image',
      folder: 'chat-app'
    });

    // fs.unlinkSync(file.path);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Error in uploadImage:", error); 
    res.status(500).json({ message: 'Failed to upload image' });
  }
};