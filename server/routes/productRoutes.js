const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @GET /api/products  — list with filters, search, pagination
router.get('/', asyncHandler(async (req, res) => {
  const page     = Number(req.query.page)  || 1;
  const limit    = Number(req.query.limit) || 12;
  const skip     = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand)    filter.brand     = req.query.brand;
  if (req.query.search)   filter.$text     = { $search: req.query.search };

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Sort options
  const sortMap = {
    newest:      { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc':{ price: -1 },
    popular:     { sold: -1 },
    rating:      { ratings: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
}));

// @GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json(products);
}));

// @GET /api/products/categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json(categories);
}));

// @GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// @POST /api/products/:id/review
router.post('/:id/review', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.ratings    = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
}));

module.exports = router;
