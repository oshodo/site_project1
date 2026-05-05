// server/routes/auth.js
const express   = require('express');
const router    = express.Router();
const passport  = require('../config/passport');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../middleware/auth');
const {
  register, login, getMe, updateProfile, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ── Standard email/password ───────────────────────────────────
router.post('/register',       register);
router.post('/login',          login);
router.get('/me',              protect, getMe);
router.put('/profile',         protect, updateProfile);
router.put('/change-password', protect, changePassword);

// ── Google OAuth ──────────────────────────────────────────────
// Step 1: Redirect user to Google consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back here with a code
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google', session: false }),
  asyncHandler(async (req, res) => {
    // req.user is set by passport strategy
    const token = generateToken(req.user._id);
    // Redirect to frontend with token in query string
    // Frontend reads the token and stores it
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientURL}/auth/callback?token=${token}&role=${req.user.role}`);
  })
);

module.exports = router;
