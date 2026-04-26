const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { Review } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

// Get product reviews
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, reviews });
}));

// Add review
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const existing = await Review.findOne({ user: req.user.id, product: productId });
  if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product' });
  const review = await Review.create({ user: req.user.id, product: productId, rating, title, comment });
  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
}));

// Update review
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (review.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  Object.assign(review, req.body);
  await review.save();
  res.json({ success: true, review });
}));

// Delete review
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await review.deleteOne();
  res.json({ success: true, message: 'Review removed' });
}));

module.exports = router;
