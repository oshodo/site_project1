// server/routes/cart.js
// Cart is primarily managed in Zustand (client state).
// This route provides server-side price validation when checking out.
const express      = require('express');
const router       = express.Router();
const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');
const { protect }  = require('../middleware/auth');

// POST /api/cart/validate — Validate cart items against real DB prices
router.post('/validate', protect, asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]

  const validated = [];
  const warnings  = [];

  for (const item of items) {
    const product = await Product.findById(item.productId).select('name price stock isActive images');

    if (!product || !product.isActive) {
      warnings.push({ productId: item.productId, issue: 'Product no longer available' });
      continue;
    }

    if (product.stock < item.quantity) {
      warnings.push({
        productId: item.productId,
        issue: `Only ${product.stock} unit(s) in stock`,
        availableQty: product.stock,
      });
    }

    validated.push({
      productId: product._id,
      name:      product.name,
      price:     product.price,      // Real server-side price
      quantity:  item.quantity,
      stock:     product.stock,
      image:     product.images?.[0]?.url || '',
    });
  }

  res.json({ success: true, data: validated, warnings });
}));

module.exports = router;
