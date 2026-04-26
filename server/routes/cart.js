const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get cart
router.get('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product', 'name price image stock');
  res.json({ success: true, cart: user.cart });
}));

// Add to cart
router.post('/add', protect, asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const user = await User.findById(req.user.id);
  const idx = user.cart.findIndex(i => i.product.toString() === productId);
  if (idx > -1) { user.cart[idx].quantity += quantity; }
  else { user.cart.push({ product: productId, quantity }); }
  await user.save();
  await user.populate('cart.product', 'name price image stock');
  res.json({ success: true, cart: user.cart });
}));

// Update cart item
router.put('/update', protect, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.id);
  const idx = user.cart.findIndex(i => i.product.toString() === productId);
  if (idx > -1) {
    if (quantity <= 0) user.cart.splice(idx, 1);
    else user.cart[idx].quantity = quantity;
  }
  await user.save();
  await user.populate('cart.product', 'name price image stock');
  res.json({ success: true, cart: user.cart });
}));

// Remove from cart
router.delete('/remove/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
  await user.save();
  res.json({ success: true, cart: user.cart });
}));

// Clear cart
router.delete('/clear', protect, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { cart: [] });
  res.json({ success: true, message: 'Cart cleared' });
}));

module.exports = router;
