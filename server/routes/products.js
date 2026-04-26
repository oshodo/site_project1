const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// ─── @GET /api/products ───────────────────────────────────────────────────────
// Query: ?page=1&limit=12&category=&search=&sort=&minPrice=&maxPrice=&featured=
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, sort, minPrice, maxPrice, featured, brand } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (brand) query.brand = new RegExp(brand, 'i');
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') },
    ];
  }

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating': { rating: -1 },
    'newest': { createdAt: -1 },
    'popular': { numReviews: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
}));

// ─── @GET /api/products/featured ─────────────────────────────────────────────
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true })
    .populate('category', 'name').limit(8).sort({ createdAt: -1 });
  res.json({ success: true, products });
}));

// ─── @GET /api/products/:id ───────────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
}));

// ─── @POST /api/products ──────────────────────────────────────────────────────
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user.id });
  res.status(201).json({ success: true, product });
}));

// ─── @PUT /api/products/:id ───────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
}));

// ─── @DELETE /api/products/:id ────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product removed' });
}));

module.exports = router;
