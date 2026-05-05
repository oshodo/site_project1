// ============================================================
// server/controllers/productController.js
// ============================================================
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// ─── GET /api/products ────────────────────────────────────────
// Supports: search, category, price range, sort, pagination
const getProducts = asyncHandler(async (req, res) => {
  const {
    search, category, minPrice, maxPrice,
    sort = '-createdAt', page = 1, limit = 12, featured,
  } = req.query;

  const query = { isActive: true };

  // Full-text search
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category) query.category = category;

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured === 'true') query.isFeatured = true;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// ─── GET /api/products/:id ────────────────────────────────────
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// ─── POST /api/products — Admin only ─────────────────────────
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, originalPrice,
    category, stock, isFeatured, tags, brand, sku,
    images, // Pre-uploaded Cloudinary image objects [{url, publicId}]
  } = req.body;

  const product = await Product.create({
    name, description, price, originalPrice,
    category, stock, isFeatured, tags, brand, sku, images,
  });

  await product.populate('category', 'name slug');
  res.status(201).json({ success: true, data: product });
});

// ─── PUT /api/products/:id — Admin only ──────────────────────
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatable = [
    'name', 'description', 'price', 'originalPrice',
    'category', 'stock', 'isFeatured', 'tags', 'brand', 'sku', 'images', 'isActive',
  ];

  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  const updated = await product.save();
  await updated.populate('category', 'name slug');

  res.json({ success: true, data: updated });
});

// ─── DELETE /api/products/:id — Soft delete, Admin only ──────
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Soft delete: mark inactive rather than removing from DB
  product.isActive = false;
  await product.save();

  // Optionally clean up Cloudinary images on hard delete
  // for (const img of product.images) await cloudinary.uploader.destroy(img.publicId);

  res.json({ success: true, message: 'Product removed successfully' });
});

// ─── POST /api/products/:id/reviews — Authenticated users ────
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  // One review per user per product
  const alreadyReviewed = product.reviews.some(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({
    user:    req.user._id,
    name:    req.user.name,
    rating:  Number(rating),
    comment,
  });

  product.updateRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added', data: product });
});

module.exports = {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, addReview,
};
