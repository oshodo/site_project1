const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// ─── @POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, username } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, username });
    const token = generateToken(user._id);
    user.lastLogin = new Date(); await user.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, token, user });
  })
);

// ─── @POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    const token = generateToken(user._id);
    user.lastLogin = new Date(); await user.save({ validateBeforeSave: false });

    res.json({ success: true, token, user });
  })
);

// ─── @GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price image');
  res.json({ success: true, user });
}));

// ─── @PUT /api/auth/profile ───────────────────────────────────────────────────
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { name, username, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, username, avatar },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
}));

// ─── @PUT /api/auth/change-password ──────────────────────────────────────────
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  user.password = newPassword;
  await user.save();
  const token = generateToken(user._id);
  res.json({ success: true, token, message: 'Password updated' });
}));

module.exports = router;
