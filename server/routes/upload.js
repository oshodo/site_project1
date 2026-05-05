// server/routes/upload.js
const express = require('express');
const router  = express.Router();
const { uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Only admins can upload/delete product images
router.post('/',          protect, adminOnly, upload.single('image'),          uploadImage);
router.post('/multiple',  protect, adminOnly, upload.array('images', 5),       uploadMultipleImages);
router.delete('/:publicId', protect, adminOnly,                                deleteImage);

module.exports = router;
