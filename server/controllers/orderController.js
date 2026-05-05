// ============================================================
// server/controllers/orderController.js
// ============================================================
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ─── POST /api/orders — Place a new order ────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Validate each product and compute real prices from DB (never trust client prices)
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
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    validatedItems.push({
      product:  product._id,
      name:     product.name,
      price:    product.price,
      quantity: item.quantity,
      image:    product.images?.[0]?.url || '',
    });

    // Decrement stock
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const shippingPrice = subtotal >= 2000 ? 0 : 100; // Free shipping over NPR 2000
  const taxPrice      = Math.round(subtotal * 0.13); // 13% VAT (Nepal)
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

// ─── GET /api/orders/my — Current user's orders ──────────────
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

// ─── GET /api/orders/:id — Single order detail ───────────────
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

// ─── PUT /api/orders/:id/status — Admin updates order status ─
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Prevent moving backward in status (unless cancelling)
  const statusOrder = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: 4 };
  if (
    status !== 'Cancelled' &&
    statusOrder[status] < statusOrder[order.status]
  ) {
    res.status(400);
    throw new Error(`Cannot move order back from "${order.status}" to "${status}"`);
  }

  order.status = status;
  if (note) order.statusHistory[order.statusHistory.length - 1].note = note;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  // If cancelled, restore stock
  if (status === 'Cancelled' && order.status !== 'Cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// ─── GET /api/orders — Admin: all orders ─────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

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
  createOrder, getMyOrders, getOrderById,
  updateOrderStatus, getAllOrders,
};
