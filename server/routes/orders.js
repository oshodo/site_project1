// server/routes/orders.js
const express = require('express');
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrderById,
  updateOrderStatus, getAllOrders,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/',          protect, createOrder);
router.get('/my',         protect, getMyOrders);
router.get('/:id',        protect, getOrderById);

// Admin routes
router.get('/',           protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
