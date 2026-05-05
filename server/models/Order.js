// ============================================================
// server/models/Order.js — Order Model with Status Flow
// ============================================================
const mongoose = require('mongoose');

// Status history entry — tracks every status change with a timestamp
const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  note:      { type: String, default: '' },
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:     { type: String, required: true },   // Snapshot at order time
  price:    { type: Number, required: true },    // Price snapshot
  quantity: { type: Number, required: true, min: 1 },
  image:    { type: String, default: '' },       // Product image snapshot
});

const orderSchema = new mongoose.Schema(
  {
    // ─── Who placed the order ─────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── Line items ───────────────────────────────────────────
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },

    // ─── Pricing ──────────────────────────────────────────────
    subtotal:      { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice:      { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true },

    // ─── Shipping Address ─────────────────────────────────────
    shippingAddress: {
      fullName: { type: String, required: true },
      phone:    { type: String, required: true },
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      zip:      { type: String, required: true },
    },

    // ─── Payment ──────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ['COD', 'eSewa', 'Khalti', 'Card'],
      default: 'COD',
    },
    isPaid:   { type: Boolean, default: false },
    paidAt:   { type: Date },
    paymentResult: {
      id:     String,
      status: String,
      email:  String,
    },

    // ─── Order Status Flow ────────────────────────────────────
    // Pending → Processing → Shipped → Delivered (or Cancelled)
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    statusHistory: [statusHistorySchema],

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    trackingNumber: { type: String, default: '' },
    notes:          { type: String, default: '' },
  },
  { timestamps: true }
);

// ─── Auto-populate status history on status change ───────────
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status });

    if (this.status === 'Delivered') {
      this.isDelivered = true;
      this.deliveredAt = new Date();
    }
  }
  next();
});

// ─── Index for fast user-order lookups ───────────────────────
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
