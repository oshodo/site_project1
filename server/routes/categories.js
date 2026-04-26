// ============================================================
// categories.js
// ============================================================
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { Category } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, categories });
}));
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, category: cat });
}));
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category: cat });
}));
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category removed' });
}));

module.exports = router;
