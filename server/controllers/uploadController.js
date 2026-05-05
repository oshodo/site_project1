// ============================================================
// server/controllers/uploadController.js
// ============================================================
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinary');

// ─── POST /api/upload — Single image upload ──────────────────
// multer middleware runs before this and attaches req.file
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // CloudinaryStorage already uploaded the file; req.file has the result
  res.status(201).json({
    success: true,
    data: {
      url:      req.file.path,        // Cloudinary secure URL
      publicId: req.file.filename,    // Cloudinary public_id
    },
  });
});

// ─── POST /api/upload/multiple — Multiple image upload ───────
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const images = req.files.map((file) => ({
    url:      file.path,
    publicId: file.filename,
  }));

  res.status(201).json({ success: true, data: images });
});

// ─── DELETE /api/upload/:publicId — Remove image from Cloudinary
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  // Cloudinary public_id may contain slashes (folder/name), decode it
  const decodedId = decodeURIComponent(publicId);

  const result = await cloudinary.uploader.destroy(decodedId);

  if (result.result !== 'ok') {
    res.status(400);
    throw new Error('Failed to delete image from Cloudinary');
  }

  res.json({ success: true, message: 'Image deleted successfully' });
});

module.exports = { uploadImage, uploadMultipleImages, deleteImage };
