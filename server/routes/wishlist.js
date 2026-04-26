const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price image rating numReviews');
  res.json({ success: true, wishlist: user.wishlist });
}));

router.post('/toggle/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.wishlist.indexOf(req.params.productId);
  let action;
  if (idx > -1) { user.wishlist.splice(idx, 1); action = 'removed'; }
  else { user.wishlist.push(req.params.productId); action = 'added'; }
  await user.save();
  res.json({ success: true, action, wishlist: user.wishlist });
}));

module.exports = router;
