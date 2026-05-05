// ============================================================
// server/controllers/orderController.js  —  BUG FIXED VERSION
// ============================================================
const asyncHandler = require('express-async-handler');
const Order   = require('../models/Order');
const Product = require('../models/Product');

// ── POST /api/orders ──────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} left.`);
    }

    subtotal += product.price * item.quantity;

    validatedItems.push({
      product:  product._id,
      name:     product.name,
      price:    product.price,       // snapshot at order time
      quantity: item.quantity,
      image:    product.images?.[0]?.url || '',
    });

    // Decrement stock immediately
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const shippingPrice = subtotal >= 2000 ? 0 : 100;
  const taxPrice      = Math.round(subtotal * 0.13);
  const totalPrice    = subtotal + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: validatedItems,
    subtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    notes,
    statusHistory: [{ status: 'Pending' }],
  });

  res.status(201).json({ success: true, data: order });
});

// ── GET /api/orders/my ────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('items.product', 'name images'),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total },
  });
});

// ── GET /api/orders/:id ───────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images price');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Users can only see their own orders; admins can see all
  if (
    req.user.role !== 'admin' &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// ── PUT /api/orders/:id/status  (Admin) ──────────────────────
// BUG FIX: save previousStatus BEFORE mutating order.status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Allowed: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // ─── SAVE PREVIOUS STATUS BEFORE ANY MUTATION ────────────
  const previousStatus = order.status;

  // Prevent moving backward (except Cancelled)
  const statusRank = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: 99 };
  if (status !== 'Cancelled' && statusRank[status] < statusRank[previousStatus]) {
    res.status(400);
    throw new Error(`Cannot move order back from "${previousStatus}" to "${status}"`);
  }

  // Prevent double-cancellation
  if (previousStatus === 'Cancelled' && status === 'Cancelled') {
    res.status(400);
    throw new Error('Order is already cancelled');
  }

  // Prevent changes to delivered orders (unless admin explicitly cancels)
  if (previousStatus === 'Delivered' && status !== 'Cancelled') {
    res.status(400);
    throw new Error('Delivered orders cannot be modified');
  }

  // Update fields
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  // Add note to the latest history entry (will be pushed by pre-save hook)
  // The hook pushes the new status; we add the note after save manually
  const saved = await order.save();

  // Attach note to the last history entry
  if (note) {
    const last = saved.statusHistory[saved.statusHistory.length - 1];
    last.note = note;
    await saved.save();
  }

  // ─── RESTORE STOCK if newly cancelled ────────────────────
  // Uses previousStatus (captured before mutation) — the real fix
  if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  const final = await Order.findById(order._id).populate('user', 'name email');
  res.json({ success: true, data: final });
});

// ── GET /api/orders  (Admin — all orders) ────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip  = (Number(page) - 1) * Number(limit);
  const query = status ? { status } : {};

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email'),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total },
  });
});

module.exports = {
  createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders,
};
