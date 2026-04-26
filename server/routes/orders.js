const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { Order } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items' });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 5000 ? 0 : 200;
  const taxPrice = Math.round(subtotal * 0.13);
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user.id, items, shippingAddress, paymentMethod, subtotal, shippingPrice, taxPrice, totalPrice,
  });
  res.status(201).json({ success: true, order });
}));

// Get user orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

// Get single order
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name image');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  res.json({ success: true, order });
}));

// Admin: all orders
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

// Admin: update order status
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const update = { status };
  if (status === 'delivered') { update.isDelivered = true; update.deliveredAt = new Date(); }
  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json({ success: true, order });
}));

module.exports = router;
