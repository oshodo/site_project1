const mongoose = require('mongoose');

// Individual review sub-schema
const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    comparePrice:{ type: Number, default: 0 },           // original price for discount display
    category:    { type: String, required: true },
    brand:       { type: String, default: '' },
    images:      [{ type: String }],                      // array of image URLs
    stock:       { type: Number, required: true, default: 0 },
    sold:        { type: Number, default: 0 },
    ratings:     { type: Number, default: 0 },
    numReviews:  { type: Number, default: 0 },
    reviews:     [reviewSchema],
    isFeatured:  { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

// Full-text search index
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
