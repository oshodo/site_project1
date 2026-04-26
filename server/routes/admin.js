const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const { Order, Category, Review } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

const auth = [protect, adminOnly];

// ─── Dashboard Analytics ──────────────────────────────────────────────────────
router.get('/dashboard', auth, asyncHandler(async (req, res) => {
  const [
    totalUsers, totalProducts, totalOrders, totalCategories,
    recentOrders, topProducts, orderStats, revenue,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Category.countDocuments({ isActive: true }),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    Product.find({ isActive: true }).sort({ numReviews: -1 }).limit(5).populate('category', 'name'),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
  ]);

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
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
      totalRevenue: revenue[0]?.total || 0,
    },
    recentOrders,
    topProducts,
    orderStats,
    monthlyRevenue,
  });
}));

// ─── User Management ─────────────────────────────────────────────────────────
router.get('/users', auth, asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

router.put('/users/:id', auth, asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true });
  res.json({ success: true, user });
}));

router.delete('/users/:id', auth, asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
}));

// ─── All Orders (admin) ───────────────────────────────────────────────────────
router.get('/orders', auth, asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

module.exports = router;
