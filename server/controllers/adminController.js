// ============================================================
// server/controllers/adminController.js
// ============================================================
const asyncHandler = require('express-async-handler');
const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// ─── GET /api/admin/dashboard — Analytics overview ───────────
const getDashboard = asyncHandler(async (req, res) => {
  const now      = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    monthlyOrders,
    monthlyRevenue,
    ordersByStatus,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: firstDay } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: firstDay }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email'),
    Product.find({ stock: { $lt: 10 }, isActive: true })
      .select('name stock price images')
      .limit(10),
  ]);

  // Build a revenue chart for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const revenueChart = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        status: { $ne: 'Cancelled' },
      },
    },
    {
      $group: {
        _id: {
          year:  { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders:  { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue:   revenueResult[0]?.total ?? 0,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total ?? 0,
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOrders,
      lowStockProducts,
      revenueChart,
    },
  });
});

// ─── GET /api/admin/users — All users ────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (search) query.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
  if (role) query.role = role;

  const [users, total] = await Promise.all([
    User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: Number(page), limit: Number(limit), total },
  });
});

// ─── PUT /api/admin/users/:id — Edit user (role, active) ─────
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive, name } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent demoting yourself
  if (req.params.id === req.user._id.toString() && role === 'user') {
    res.status(400);
    throw new Error('You cannot demote yourself');
  }

  if (role     !== undefined) user.role     = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (name     !== undefined) user.name     = name;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// ─── DELETE /api/admin/users/:id — Remove user ───────────────
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = { getDashboard, getAllUsers, updateUser, deleteUser };
