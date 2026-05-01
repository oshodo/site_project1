const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { Order } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items in order' });

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = subtotal > 5000 ? 0 : 200;
  const taxPrice = Math.round(subtotal * 0.13);
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user.id, items, shippingAddress, paymentMethod,
    subtotal, shippingPrice, taxPrice, totalPrice,
    timeline: [{ status: 'pending', message: 'Order placed successfully', date: new Date() }],
  });
  res.status(201).json({ success: true, order });
}));

// My orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

// Single order
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name image');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Not authorized' });
  res.json({ success: true, order });
}));

// Admin: all orders
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const query = status ? { status } : {};
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const total = await Order.countDocuments(query);
  res.json({ success: true, orders, total });
}));

// Admin: update status with timeline
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const statusMessages = {
    pending: 'Order received and pending confirmation',
    processing: 'Order is being processed and packed',
    shipped: 'Order has been shipped and is on the way',
    delivered: 'Order delivered successfully',
    cancelled: 'Order has been cancelled',
  };

  const update = {
    status,
    $push: {
      timeline: {
        status,
        message: message || statusMessages[status] || `Status updated to ${status}`,
        date: new Date(),
      }
    }
  };

  if (status === 'delivered') {
    update.isDelivered = true;
    update.deliveredAt = new Date();
  }
  if (status === 'shipped') {
    update.shippedAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate('user', 'name email');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
}));

// Admin: update tracking info
router.put('/:id/tracking', protect, adminOnly, asyncHandler(async (req, res) => {
  const { trackingNumber, carrier, estimatedDelivery } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { trackingNumber, carrier, estimatedDelivery },
    { new: true }
  );
  res.json({ success: true, order });
}));

module.exports = router;
