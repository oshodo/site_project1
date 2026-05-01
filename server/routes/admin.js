const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const { Order, Category, Review } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

const auth = [protect, adminOnly];

// Dashboard
router.get('/dashboard', auth, asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, totalCategories] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Category.countDocuments({ isActive: true }),
  ]);

  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(8);

  const topProducts = await Product.find({ isActive: true })
    .sort({ numReviews: -1 })
    .limit(5)
    .populate('category', 'name');

  const orderStats = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
    { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$totalPrice' },
      orders: { $sum: 1 },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers, totalProducts, totalOrders, totalCategories,
      totalRevenue: revenueData[0]?.total || 0,
    },
    recentOrders, topProducts, orderStats, monthlyRevenue,
  });
}));

// Users
router.get('/users', auth, asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 50 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  const users = await User.find(query).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
  const total = await User.countDocuments(query);
  res.json({ success: true, users, total });
}));

router.put('/users/:id', auth, asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  if (req.params.id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot modify your own account' });
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true });
  res.json({ success: true, user });
}));

router.delete('/users/:id', auth, asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
}));

// Orders
router.get('/orders', auth, asyncHandler(async (req, res) => {
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

module.exports = router;
