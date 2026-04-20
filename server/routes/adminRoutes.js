const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const User    = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, admin);

/* ───── Dashboard Stats ───── */
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, revenueData] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);
  const totalRevenue = revenueData[0]?.total || 0;
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
  res.json({ totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders });
}));

/* ───── Product Management ───── */
router.get('/products', asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}));

router.post('/products', asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

router.put('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}));

/* ───── Order Management ───── */
router.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(orders);
}));

router.put('/orders/:id/status', asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, ...(req.body.status === 'delivered' ? { deliveredAt: Date.now() } : {}) },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

/* ───── User Management ───── */
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role, isActive: req.body.isActive }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
}));

module.exports = router;
