const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/authMiddleware');

// @POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill all fields' });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, token: generateToken(user._id),
  });
}));

// @POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, token: generateToken(user._id),
  });
}));

// @GET /api/auth/profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
}));

// @PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name    = req.body.name    || user.name;
  user.email   = req.body.email   || user.email;
  user.phone   = req.body.phone   || user.phone;
  user.address = req.body.address || user.address;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    _id: updated._id, name: updated.name, email: updated.email,
    role: updated.role, token: generateToken(updated._id),
  });
}));

module.exports = router;
