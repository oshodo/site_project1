// server/routes/categories.js
const express    = require('express');
const router     = express.Router();
const Category   = require('../models/Category');
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, data: cats });
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const cat  = await Category.create({ name, slug, description, image });
  res.status(201).json({ success: true, data: cat });
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, data: cat });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, message: 'Category removed' });
}));

module.exports = router;
