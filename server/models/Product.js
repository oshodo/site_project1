// ============================================================
// server/models/Product.js — Product Model with Cloudinary Images
// ============================================================
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    // ─── Cloudinary Image Fields ──────────────────────────────
    images: [
      {
        url:       { type: String, required: true },   // Cloudinary secure URL
        publicId:  { type: String, required: true },   // Cloudinary public_id for deletion
        alt:       { type: String, default: '' },
      },
    ],
    // ─── Category Reference ───────────────────────────────────
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    // ─── Inventory & Status ───────────────────────────────────
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isActive:  { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags:      [{ type: String, lowercase: true }],
    brand:     { type: String, default: '' },
    sku:       { type: String, unique: true, sparse: true },

    // ─── Computed Review Stats ────────────────────────────────
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating:     { type: Number, default: 0, min: 0, max: 5 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Full-text search index ───────────────────────────────────
productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

// ─── Method: recalculate average rating after review changes ─
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.numReviews = 0;
    this.rating = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  }
};

// ─── Virtual: discount percentage ─────────────────────────────
productSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

module.exports = mongoose.model('Product', productSchema);
