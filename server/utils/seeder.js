// ============================================================
// server/utils/seeder.js
// Run from the server/ directory:  node utils/seeder.js
// ============================================================
const path = require('path');
// FIX: use __dirname so the path is always correct regardless of CWD
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose  = require('mongoose');
const User      = require('../models/User');
const Product   = require('../models/Product');
const Category  = require('../models/Category');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI not found in server/.env — did you fill it in?');
  process.exit(1);
}

// ── Sample Data ───────────────────────────────────────────────
const categories = [
  { name: 'Electronics',   slug: 'electronics',   description: 'Gadgets and devices' },
  { name: 'Clothing',      slug: 'clothing',       description: 'Fashion and apparel' },
  { name: 'Home & Living', slug: 'home-living',    description: 'Furniture and decor' },
  { name: 'Sports',        slug: 'sports',         description: 'Sports equipment & gear' },
  { name: 'Books',         slug: 'books',          description: 'Books and stationery' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB Connected');

    // Wipe existing data
    await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany()]);
    console.log('🗑️   Cleared existing data');

    // Create categories
    const createdCats = await Category.insertMany(categories);
    const catMap = createdCats.reduce((m, c) => ({ ...m, [c.slug]: c._id }), {});
    console.log(`✅  ${createdCats.length} categories created`);

    // ── Admin accounts ───────────────────────────────────────
    // jeevan808078018@gmail.com is the PRIMARY admin (Google login)
    const adminGoogle = await User.create({
      name:     'Jeevan Don',
      email:    'jeevan808078018@gmail.com',
      role:     'admin',
      // No password — this account uses Google Sign-In
      // Google OAuth will set googleId on first login
    });

    // Fallback local admin (in case you need email/password login)
    const adminLocal = await User.create({
      name:     'Admin',
      email:    process.env.ADMIN_EMAIL    || 'admin@sabaisale.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@Sabaisale123',
      role:     'admin',
    });

    console.log(`✅  Admin (Google) : ${adminGoogle.email}`);
    console.log(`✅  Admin (Local)  : ${adminLocal.email}`);

    // ── Sample Products ──────────────────────────────────────
    const products = [
      {
        name: 'Samsung Galaxy A54',
        description: 'Feature-packed mid-range smartphone with AMOLED display, 5000mAh battery, and triple camera.',
        price: 45000, originalPrice: 52000,
        category: catMap['electronics'], stock: 25, isFeatured: true, brand: 'Samsung',
        images: [{ url: 'https://placehold.co/800x800/1a1a2e/ffffff?text=Galaxy+A54', publicId: 'sample_1' }],
        tags: ['smartphone', 'samsung', '5g'],
      },
      {
        name: 'JBL Wireless Earbuds',
        description: 'True wireless earbuds with active noise cancellation and 30-hour battery life.',
        price: 8500, originalPrice: 11000,
        category: catMap['electronics'], stock: 40, isFeatured: true, brand: 'JBL',
        images: [{ url: 'https://placehold.co/800x800/0f3460/ffffff?text=JBL+Earbuds', publicId: 'sample_2' }],
        tags: ['earbuds', 'wireless', 'jbl'],
      },
      {
        name: "Levi's 511 Slim Jeans",
        description: 'Classic slim-fit denim jeans. Comfortable stretch fabric for all-day wear.',
        price: 4800, originalPrice: 6500,
        category: catMap['clothing'], stock: 60, isFeatured: true, brand: "Levi's",
        images: [{ url: 'https://placehold.co/800x800/16213e/ffffff?text=Levis+511', publicId: 'sample_3' }],
        tags: ['jeans', 'denim', 'levis'],
      },
      {
        name: 'Nike Dri-FIT T-Shirt',
        description: 'Moisture-wicking sports t-shirt. Perfect for workouts and casual wear.',
        price: 2200, originalPrice: 3000,
        category: catMap['clothing'], stock: 80, brand: 'Nike',
        images: [{ url: 'https://placehold.co/800x800/533483/ffffff?text=Nike+Shirt', publicId: 'sample_4' }],
        tags: ['tshirt', 'nike', 'sports'],
      },
      {
        name: 'Wooden Coffee Table',
        description: 'Solid wood coffee table with minimalist Scandinavian design. Easy assembly.',
        price: 12000, originalPrice: 15000,
        category: catMap['home-living'], stock: 10, isFeatured: true,
        images: [{ url: 'https://placehold.co/800x800/2c3e50/ffffff?text=Coffee+Table', publicId: 'sample_5' }],
        tags: ['furniture', 'wood', 'table'],
      },
      {
        name: 'Yoga Mat Pro',
        description: 'Non-slip 6mm thick yoga mat with alignment lines and carrying strap.',
        price: 1800, originalPrice: 2500,
        category: catMap['sports'], stock: 50,
        images: [{ url: 'https://placehold.co/800x800/27ae60/ffffff?text=Yoga+Mat', publicId: 'sample_6' }],
        tags: ['yoga', 'fitness', 'mat'],
      },
      {
        name: 'Xiaomi Redmi Note 13',
        description: '108MP camera smartphone with 5000mAh battery and AMOLED display.',
        price: 28000, originalPrice: 32000,
        category: catMap['electronics'], stock: 35, brand: 'Xiaomi',
        images: [{ url: 'https://placehold.co/800x800/c0392b/ffffff?text=Redmi+Note+13', publicId: 'sample_7' }],
        tags: ['smartphone', 'xiaomi', 'camera'],
      },
      {
        name: 'Adidas Running Shoes',
        description: 'Lightweight running shoes with Boost cushioning. Ideal for long-distance runs.',
        price: 9500, originalPrice: 12000,
        category: catMap['sports'], stock: 30, isFeatured: true, brand: 'Adidas',
        images: [{ url: 'https://placehold.co/800x800/2980b9/ffffff?text=Adidas+Shoes', publicId: 'sample_8' }],
        tags: ['shoes', 'running', 'adidas'],
      },
      {
        name: 'Atomic Habits (Book)',
        description: "James Clear's #1 bestseller on building good habits and breaking bad ones.",
        price: 650, originalPrice: 800,
        category: catMap['books'], stock: 100, isFeatured: true,
        images: [{ url: 'https://placehold.co/800x800/8e44ad/ffffff?text=Atomic+Habits', publicId: 'sample_9' }],
        tags: ['book', 'self-help', 'habits'],
      },
      {
        name: 'Apple AirPods Pro',
        description: 'Premium wireless earbuds with adaptive transparency and spatial audio.',
        price: 32000, originalPrice: 38000,
        category: catMap['electronics'], stock: 15, isFeatured: true, brand: 'Apple',
        images: [{ url: 'https://placehold.co/800x800/1abc9c/ffffff?text=AirPods+Pro', publicId: 'sample_10' }],
        tags: ['earbuds', 'apple', 'airpods'],
      },
    ];

    const created = await Product.insertMany(products);
    console.log(`✅  ${created.length} products created`);

    console.log('\n🎉  Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ADMIN LOGIN OPTIONS:');
    console.log('  Google Sign-In → jeevan808078018@gmail.com');
    console.log(`  Email/Password → ${adminLocal.email}`);
    console.log(`  Password       → ${process.env.ADMIN_PASSWORD || 'Admin@Sabaisale123'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌  Seeder error:', err.message);
    process.exit(1);
  }
};

seed();
