// server/routes/wishlist.js
const express      = require('express');
const router       = express.Router();
const asyncHandler = require('express-async-handler');
const User         = require('../models/User');
const { protect }  = require('../middleware/auth');

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images rating');
  res.json({ success: true, data: user.wishlist });
}));

router.post('/toggle/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid  = req.params.productId;
  const idx  = user.wishlist.indexOf(pid);

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    await user.save();
    return res.json({ success: true, added: false, message: 'Removed from wishlist' });
  }

  user.wishlist.push(pid);
  await user.save();
  res.json({ success: true, added: true, message: 'Added to wishlist' });
}));

module.exports = router;
