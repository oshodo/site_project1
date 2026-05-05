// server/routes/reviews.js
const express      = require('express');
const router       = express.Router();
const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');
const { protect }  = require('../middleware/auth');

// GET /api/reviews/product/:productId
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)
    .populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, data: product.reviews });
}));

// DELETE /api/reviews/:productId/:reviewId
router.delete('/:productId/:reviewId', protect, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) { res.status(404); throw new Error('Review not found'); }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }

  review.deleteOne();
  product.updateRating();
  await product.save();

  res.json({ success: true, message: 'Review deleted' });
}));

module.exports = router;
