// ============================================================
// server/middleware/auth.js — JWT Auth & Admin Guard
// ============================================================
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ─── protect ─────────────────────────────────────────────────
// Validates JWT and attaches req.user. Used on all protected routes.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Accept token from Authorization header: "Bearer <token>"
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach full user object (minus password) to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (!req.user.isActive) {
      res.status(403);
      throw new Error('Your account has been deactivated. Contact support.');
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Token has expired, please login again');
    }
    throw err;
  }
});

// ─── adminOnly ───────────────────────────────────────────────
// Must be used AFTER protect. Checks that the user has admin role.
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403);
  throw new Error('Access denied — admin only');
};

// ─── generateToken ───────────────────────────────────────────
// Creates a signed JWT for a given user id.
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = { protect, adminOnly, generateToken };
