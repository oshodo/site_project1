// ============================================================
// server/controllers/authController.js
// ============================================================
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// ─── POST /api/auth/register ──────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // select('+password') because password has select:false in schema
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account deactivated. Contact support.');
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    data: {
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
      token:  generateToken(user._id),
    },
  });
});

// ─── GET /api/auth/me ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
  res.json({ success: true, data: user });
});

// ─── PUT /api/auth/profile ────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address, avatar },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user });
});

// ─── PUT /api/auth/change-password ───────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, getMe, updateProfile, changePassword };
