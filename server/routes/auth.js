const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// ─── Register ─────────────────────────────────────────────────────────────────
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  })
);

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    const token = generateToken(user._id);
    user.lastLogin = new Date(); await user.save({ validateBeforeSave: false });
    res.json({ success: true, token, user });
  })
);

// ─── Get Me ───────────────────────────────────────────────────────────────────
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price image');
  res.json({ success: true, user });
}));

// ─── Update Profile ───────────────────────────────────────────────────────────
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { name, username, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, username, avatar }, { new: true, runValidators: true });
  res.json({ success: true, user });
}));

// ─── Change Password ──────────────────────────────────────────────────────────
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword)))
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, token: generateToken(user._id), message: 'Password updated' });
}));

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: Redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false }),
  asyncHandler(async (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
  })
);

module.exports = router;
