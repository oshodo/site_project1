const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage — buffer uploaded directly to Cloudinary via base64
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// @POST /api/upload
router.post('/', protect, adminOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'sabaisale',
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  });

  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
}));

module.exports = router;
