// ============================================================
// server/utils/seeder.js — Seed admin + categories + products
// Run: node utils/seeder.js
// ============================================================
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User     = require('../models/User');
const Product  = require('../models/Product');
const Category = require('../models/Category');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sabaisale';

const categories = [
  { name: 'Electronics',  slug: 'electronics',  description: 'Gadgets and devices' },
  { name: 'Clothing',     slug: 'clothing',      description: 'Fashion and apparel' },
  { name: 'Home & Living',slug: 'home-living',   description: 'Furniture and decor' },
  { name: 'Sports',       slug: 'sports',        description: 'Sports equipment and gear' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCats = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCats.length} categories`);

    // Map by slug for easy reference
    const catMap = createdCats.reduce((m, c) => ({ ...m, [c.slug]: c._id }), {});

    // Create admin user
    const admin = await User.create({
      name:     'Jeevan Don',
      email:    process.env.ADMIN_EMAIL    || 'admin@sabaisale.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role:     'admin',
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create sample products
    const products = [
      {
        name: 'Samsung Galaxy A54',
        description: 'Feature-packed mid-range smartphone with AMOLED display.',
        price: 45000, originalPrice: 52000,
        category: catMap['electronics'], stock: 25, isFeatured: true, brand: 'Samsung',
        images: [{ url: 'https://placehold.co/800x800?text=Galaxy+A54', publicId: 'sample1' }],
      },
      {
        name: 'JBL Wireless Earbuds',
        description: 'True wireless earbuds with active noise cancellation.',
        price: 8500, originalPrice: 11000,
        category: catMap['electronics'], stock: 40, isFeatured: true, brand: 'JBL',
        images: [{ url: 'https://placehold.co/800x800?text=JBL+Earbuds', publicId: 'sample2' }],
      },
      {
        name: 'Levi\'s 511 Slim Jeans',
        description: 'Classic slim-fit denim jeans. Comfortable for all-day wear.',
        price: 4800, originalPrice: 6500,
        category: catMap['clothing'], stock: 60, isFeatured: true, brand: 'Levi\'s',
        images: [{ url: 'https://placehold.co/800x800?text=Levis+Jeans', publicId: 'sample3' }],
      },
      {
        name: 'Nike Dri-FIT T-Shirt',
        description: 'Moisture-wicking sports t-shirt. Perfect for workouts.',
        price: 2200, originalPrice: 3000,
        category: catMap['clothing'], stock: 80, brand: 'Nike',
        images: [{ url: 'https://placehold.co/800x800?text=Nike+Shirt', publicId: 'sample4' }],
      },
      {
        name: 'Wooden Coffee Table',
        description: 'Solid wood coffee table with minimalist Scandinavian design.',
        price: 12000, originalPrice: 15000,
        category: catMap['home-living'], stock: 10, isFeatured: true,
        images: [{ url: 'https://placehold.co/800x800?text=Coffee+Table', publicId: 'sample5' }],
      },
      {
        name: 'Yoga Mat Pro',
        description: 'Non-slip 6mm thick yoga mat with carrying strap.',
        price: 1800, originalPrice: 2500,
        category: catMap['sports'], stock: 50,
        images: [{ url: 'https://placehold.co/800x800?text=Yoga+Mat', publicId: 'sample6' }],
      },
      {
        name: 'Xiaomi Redmi Note 13',
        description: '108MP camera smartphone with 5000mAh battery.',
        price: 28000, originalPrice: 32000,
        category: catMap['electronics'], stock: 35, brand: 'Xiaomi',
        images: [{ url: 'https://placehold.co/800x800?text=Redmi+Note+13', publicId: 'sample7' }],
      },
      {
        name: 'Adidas Running Shoes',
        description: 'Lightweight running shoes with Boost cushioning technology.',
        price: 9500, originalPrice: 12000,
        category: catMap['sports'], stock: 30, isFeatured: true, brand: 'Adidas',
        images: [{ url: 'https://placehold.co/800x800?text=Adidas+Shoes', publicId: 'sample8' }],
      },
    ];

    const created = await Product.insertMany(products);
    console.log(`✅ Created ${created.length} products`);
    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n🔑 Admin Login:\n   Email: ${admin.email}\n   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    process.exit(1);
  }
};

seed();
