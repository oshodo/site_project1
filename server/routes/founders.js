const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { Founder } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const founders = await Founder.find().sort({ order: 1 });
  res.json({ success: true, founders });
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const founder = await Founder.create(req.body);
  res.status(201).json({ success: true, founder });
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const founder = await Founder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!founder) return res.status(404).json({ success: false, message: 'Founder not found' });
  res.json({ success: true, founder });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Founder.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Founder removed' });
}));

module.exports = router;
