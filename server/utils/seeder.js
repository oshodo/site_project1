const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const { Category, Founder } = require('../models/index');

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '💻', description: 'Latest gadgets and tech', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', description: 'Trendy clothing and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600' },
  { name: 'Home', slug: 'home', icon: '🏠', description: 'Furniture and home essentials', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600' },
  { name: 'Accessories', slug: 'accessories', icon: '👜', description: 'Watches, bags and more', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600' },
];

const founders = [
  {
    name: 'Jeevan Don',
    role: 'CEO & Co-Founder',
    bio: 'Visionary entrepreneur with a passion for connecting Nepali consumers with premium products. Jeevan leads SabaiSale with a mission to transform e-commerce in Nepal.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    social: { linkedin: '#', twitter: '#', instagram: '#' },
    order: 1,
  },
  {
    name: 'Sabai Lama',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack developer and tech innovator who built SabaiSale from the ground up. Passionate about creating seamless digital experiences for Nepali shoppers.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    social: { linkedin: '#', twitter: '#', instagram: '#' },
    order: 2,
  },
];

const getProducts = (catMap) => [
  // Electronics (15 products)
  { name: 'Apple MacBook Pro 14"', price: 185000, originalPrice: 210000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', description: 'M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful MacBook ever.', brand: 'Apple', stock: 15, rating: 4.9, numReviews: 128, featured: true, tags: ['laptop', 'apple', 'macbook'] },
  { name: 'Samsung Galaxy S24 Ultra', price: 145000, originalPrice: 165000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', description: '200MP camera, built-in S Pen, 12GB RAM. Flagship Android phone.', brand: 'Samsung', stock: 25, rating: 4.8, numReviews: 203, featured: true, tags: ['phone', 'samsung', 'android'] },
  { name: 'Sony WH-1000XM5 Headphones', price: 32000, originalPrice: 38000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', description: 'Industry-leading noise cancellation with 30-hour battery life.', brand: 'Sony', stock: 40, rating: 4.9, numReviews: 456, featured: true, tags: ['headphones', 'sony', 'audio'] },
  { name: 'iPad Pro 12.9"', price: 120000, originalPrice: 135000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', description: 'M2 chip, Liquid Retina XDR display, with Apple Pencil support.', brand: 'Apple', stock: 20, rating: 4.8, numReviews: 89, featured: false, tags: ['tablet', 'apple', 'ipad'] },
  { name: 'Dell XPS 15 Laptop', price: 165000, originalPrice: 185000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', description: '13th Gen Intel Core i7, OLED display, 32GB RAM.', brand: 'Dell', stock: 10, rating: 4.7, numReviews: 67, featured: false, tags: ['laptop', 'dell', 'windows'] },
  { name: 'Apple Watch Series 9', price: 55000, originalPrice: 62000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600', description: 'Advanced health monitoring, crash detection, and always-on display.', brand: 'Apple', stock: 30, rating: 4.8, numReviews: 234, featured: true, tags: ['smartwatch', 'apple', 'wearable'] },
  { name: 'Canon EOS R50 Camera', price: 82000, originalPrice: 95000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600', description: '24.2MP APS-C sensor, 4K video, perfect for creators.', brand: 'Canon', stock: 12, rating: 4.6, numReviews: 45, featured: false, tags: ['camera', 'canon', 'photography'] },
  { name: 'LG OLED 55" TV', price: 175000, originalPrice: 210000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600', description: 'Perfect blacks, stunning colors, 120Hz for gaming and movies.', brand: 'LG', stock: 8, rating: 4.9, numReviews: 112, featured: false, tags: ['tv', 'lg', 'oled'] },
  { name: 'Nintendo Switch OLED', price: 42000, originalPrice: 48000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600', description: 'Vibrant 7" OLED screen, enhanced audio, 64GB storage.', brand: 'Nintendo', stock: 35, rating: 4.7, numReviews: 389, featured: false, tags: ['gaming', 'nintendo', 'console'] },
  { name: 'JBL Charge 5 Speaker', price: 18000, originalPrice: 22000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', description: 'IP67 waterproof, 20-hour playtime, party boost feature.', brand: 'JBL', stock: 50, rating: 4.6, numReviews: 178, featured: false, tags: ['speaker', 'jbl', 'bluetooth'] },
  { name: 'iPhone 15 Pro', price: 155000, originalPrice: 175000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1695048133142-1a20484428d1?w=600', description: 'Titanium design, A17 Pro chip, 48MP camera system.', brand: 'Apple', stock: 20, rating: 4.9, numReviews: 567, featured: true, tags: ['phone', 'apple', 'iphone'] },
  { name: 'Samsung Galaxy Tab S9', price: 78000, originalPrice: 92000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=600', description: 'Dynamic AMOLED display, Snapdragon 8 Gen 2, S Pen included.', brand: 'Samsung', stock: 18, rating: 4.7, numReviews: 93, featured: false, tags: ['tablet', 'samsung', 'android'] },
  { name: 'Logitech MX Master 3S', price: 12500, originalPrice: 14500, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', description: 'Ultra-precise 8K DPI sensor, 70-day battery, ergonomic design.', brand: 'Logitech', stock: 60, rating: 4.8, numReviews: 234, featured: false, tags: ['mouse', 'logitech', 'peripheral'] },
  { name: 'DJI Mini 4 Pro Drone', price: 95000, originalPrice: 110000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600', description: '4K/60fps video, 34-min flight, obstacle sensing.', brand: 'DJI', stock: 7, rating: 4.8, numReviews: 56, featured: false, tags: ['drone', 'dji', 'aerial'] },
  { name: 'AirPods Pro 2nd Gen', price: 28000, originalPrice: 32000, category: catMap['Electronics'], image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600', description: 'Active noise cancellation, adaptive audio, MagSafe charging.', brand: 'Apple', stock: 45, rating: 4.8, numReviews: 678, featured: true, tags: ['earbuds', 'apple', 'audio'] },

  // Fashion (12 products)
  { name: 'Nike Air Max 270', price: 15000, originalPrice: 18000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', description: 'Iconic Air Max unit, breathable mesh upper, all-day comfort.', brand: 'Nike', stock: 60, rating: 4.7, numReviews: 345, featured: true, tags: ['shoes', 'nike', 'sneakers'] },
  { name: 'Levi\'s 501 Original Jeans', price: 7500, originalPrice: 9000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', description: 'Classic straight fit, 100% cotton denim, timeless design.', brand: 'Levi\'s', stock: 80, rating: 4.6, numReviews: 234, featured: false, tags: ['jeans', 'levis', 'denim'] },
  { name: 'Adidas Ultraboost 23', price: 17500, originalPrice: 21000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', description: 'BOOST cushioning, Primeknit upper, responsive running shoe.', brand: 'Adidas', stock: 45, rating: 4.8, numReviews: 189, featured: true, tags: ['shoes', 'adidas', 'running'] },
  { name: 'Polo Ralph Lauren Shirt', price: 8500, originalPrice: 10000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600', description: 'Classic polo shirt, pique cotton, embroidered pony logo.', brand: 'Ralph Lauren', stock: 100, rating: 4.5, numReviews: 123, featured: false, tags: ['shirt', 'polo', 'fashion'] },
  { name: 'The North Face Puffer Jacket', price: 22000, originalPrice: 28000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', description: '700-fill goose down, DWR finish, perfect for Himalayan winters.', brand: 'The North Face', stock: 30, rating: 4.8, numReviews: 167, featured: true, tags: ['jacket', 'northface', 'winter'] },
  { name: 'Zara Summer Dress', price: 4500, originalPrice: 6000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', description: 'Flowy midi dress, floral print, perfect for summer occasions.', brand: 'Zara', stock: 55, rating: 4.4, numReviews: 89, featured: false, tags: ['dress', 'zara', 'women'] },
  { name: 'H&M Slim Fit Chinos', price: 3500, originalPrice: 4500, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', description: 'Stretch cotton, slim fit, versatile for work or weekend.', brand: 'H&M', stock: 90, rating: 4.3, numReviews: 56, featured: false, tags: ['pants', 'chinos', 'men'] },
  { name: 'Converse Chuck Taylor High', price: 8000, originalPrice: 9500, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600', description: 'Classic canvas high-top, vulcanized rubber sole, iconic design.', brand: 'Converse', stock: 70, rating: 4.6, numReviews: 412, featured: false, tags: ['shoes', 'converse', 'classic'] },
  { name: 'Uniqlo Ultra Light Down', price: 6500, originalPrice: 8000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600', description: 'Packable down jacket, lightweight, exceptional warmth-to-weight ratio.', brand: 'Uniqlo', stock: 40, rating: 4.7, numReviews: 203, featured: false, tags: ['jacket', 'uniqlo', 'light'] },
  { name: 'Puma RS-X Sneakers', price: 11000, originalPrice: 13500, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600', description: 'Retro-inspired chunky sole, multi-layered mesh upper, bold colorway.', brand: 'Puma', stock: 35, rating: 4.5, numReviews: 78, featured: false, tags: ['shoes', 'puma', 'sneakers'] },
  { name: 'Tommy Hilfiger Hoodie', price: 9500, originalPrice: 12000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', description: 'Signature logo, premium fleece cotton blend, relaxed fit.', brand: 'Tommy Hilfiger', stock: 50, rating: 4.6, numReviews: 134, featured: false, tags: ['hoodie', 'tommy', 'casual'] },
  { name: 'Lululemon Yoga Set', price: 14500, originalPrice: 17000, category: catMap['Fashion'], image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600', description: 'Moisture-wicking fabric, 4-way stretch, perfect for yoga and gym.', brand: 'Lululemon', stock: 25, rating: 4.8, numReviews: 89, featured: false, tags: ['yoga', 'lululemon', 'activewear'] },

  // Home (12 products)
  { name: 'Dyson V15 Vacuum', price: 65000, originalPrice: 78000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', description: 'Laser dust detection, HEPA filtration, 60-min run time.', brand: 'Dyson', stock: 15, rating: 4.9, numReviews: 167, featured: true, tags: ['vacuum', 'dyson', 'cleaning'] },
  { name: 'IKEA KALLAX Shelf Unit', price: 12000, originalPrice: 14500, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', description: '4x4 cube storage, versatile for books, decor and storage boxes.', brand: 'IKEA', stock: 25, rating: 4.6, numReviews: 234, featured: false, tags: ['furniture', 'ikea', 'storage'] },
  { name: 'Philips Hue Smart Bulb Set', price: 8500, originalPrice: 10000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1558618047-3c9b68e3fa21?w=600', description: '16 million colors, works with Alexa & Google Home, 4-pack.', brand: 'Philips', stock: 60, rating: 4.7, numReviews: 345, featured: false, tags: ['smart home', 'philips', 'lighting'] },
  { name: 'Instant Pot Duo 7-in-1', price: 18000, originalPrice: 22000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600', description: 'Pressure cooker, slow cooker, rice cooker and more. 6-quart.', brand: 'Instant Pot', stock: 30, rating: 4.8, numReviews: 567, featured: true, tags: ['kitchen', 'cooking', 'appliance'] },
  { name: 'Casper Sleep Pillow', price: 5500, originalPrice: 6800, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600', description: 'Cooling technology, adjustable fill, perfect spinal alignment.', brand: 'Casper', stock: 80, rating: 4.6, numReviews: 189, featured: false, tags: ['pillow', 'sleep', 'bedroom'] },
  { name: 'Nespresso Vertuo Coffee', price: 22000, originalPrice: 26000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600', description: 'Centrifusion extraction, 5 cup sizes, smart one-touch system.', brand: 'Nespresso', stock: 20, rating: 4.7, numReviews: 298, featured: false, tags: ['coffee', 'nespresso', 'kitchen'] },
  { name: 'Himalayan Salt Lamp', price: 2500, originalPrice: 3200, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1544829832-e8d14a44cd8b?w=600', description: 'Natural Himalayan crystal, warm amber glow, air purifying.', brand: 'Himalayan Art', stock: 100, rating: 4.5, numReviews: 456, featured: false, tags: ['lamp', 'decor', 'himalayan'] },
  { name: 'MUJI Aromatherapy Diffuser', price: 7500, originalPrice: 9000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600', description: 'Ultrasonic diffuser, timer function, auto shut-off, 3 colors.', brand: 'MUJI', stock: 40, rating: 4.7, numReviews: 123, featured: false, tags: ['diffuser', 'muji', 'wellness'] },
  { name: 'Le Creuset Dutch Oven', price: 35000, originalPrice: 42000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600', description: 'Enameled cast iron, 5.5 quart, lifetime warranty, oven safe to 500°F.', brand: 'Le Creuset', stock: 12, rating: 4.9, numReviews: 234, featured: false, tags: ['cookware', 'le creuset', 'kitchen'] },
  { name: 'Wooden Bookshelf 5-Tier', price: 14500, originalPrice: 18000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600', description: 'Solid wood, industrial pipe design, 5-tier with metal accents.', brand: 'HomeVibe', stock: 18, rating: 4.5, numReviews: 67, featured: false, tags: ['bookshelf', 'furniture', 'wood'] },
  { name: 'Roomba j7+ Robot Vacuum', price: 85000, originalPrice: 99000, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600', description: 'Smart mapping, avoids obstacles, self-emptying base included.', brand: 'iRobot', stock: 8, rating: 4.8, numReviews: 145, featured: true, tags: ['robot', 'vacuum', 'smart home'] },
  { name: 'Bamboo Organizer Set', price: 1800, originalPrice: 2500, category: catMap['Home'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', description: 'Eco-friendly bamboo, 6-piece set, perfect for desk or kitchen.', brand: 'EcoHome', stock: 150, rating: 4.4, numReviews: 89, featured: false, tags: ['organizer', 'bamboo', 'eco'] },

  // Accessories (12 products)
  { name: 'Rolex Submariner Homage', price: 45000, originalPrice: 55000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', description: 'Automatic movement, 300m water resistance, ceramic bezel.', brand: 'TimeCraft', stock: 10, rating: 4.8, numReviews: 78, featured: true, tags: ['watch', 'automatic', 'luxury'] },
  { name: 'Leather Messenger Bag', price: 9500, originalPrice: 12000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', description: 'Genuine leather, 15" laptop compartment, adjustable strap.', brand: 'CraftLeather', stock: 25, rating: 4.7, numReviews: 134, featured: false, tags: ['bag', 'leather', 'laptop bag'] },
  { name: 'Ray-Ban Aviator Classic', price: 16500, originalPrice: 19000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', description: 'Gold metal frame, classic G-15 green lenses, 100% UV protection.', brand: 'Ray-Ban', stock: 40, rating: 4.8, numReviews: 289, featured: true, tags: ['sunglasses', 'rayban', 'eyewear'] },
  { name: 'Fossil Crossbody Bag', price: 7500, originalPrice: 9500, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600', description: 'Vegan leather, multiple compartments, chain strap, small but mighty.', brand: 'Fossil', stock: 35, rating: 4.5, numReviews: 167, featured: false, tags: ['bag', 'crossbody', 'women'] },
  { name: 'Titanium Wedding Band', price: 8000, originalPrice: 10000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', description: 'Lightweight titanium, brushed finish, comfort-fit band, sizes 6-13.', brand: 'JewelCraft', stock: 30, rating: 4.6, numReviews: 56, featured: false, tags: ['ring', 'titanium', 'jewelry'] },
  { name: 'Longchamp Le Pliage Tote', price: 14500, originalPrice: 17000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', description: 'Iconic foldable design, nylon and leather, fits laptop up to 13".', brand: 'Longchamp', stock: 22, rating: 4.7, numReviews: 234, featured: false, tags: ['tote', 'longchamp', 'bag'] },
  { name: 'Leather Wallet Slim', price: 3500, originalPrice: 4500, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=600', description: 'Full-grain leather, RFID blocking, 8 card slots, minimal profile.', brand: 'SlimCarry', stock: 80, rating: 4.6, numReviews: 345, featured: false, tags: ['wallet', 'leather', 'rfid'] },
  { name: 'Casio G-Shock Watch', price: 12000, originalPrice: 15000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600', description: 'Shock resistant, 20-bar water resistance, solar powered, tough.', brand: 'Casio', stock: 50, rating: 4.7, numReviews: 567, featured: false, tags: ['watch', 'casio', 'gshock'] },
  { name: 'Beaded Bracelet Set', price: 1500, originalPrice: 2000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', description: 'Natural gemstone beads, stackable set of 5, unisex design.', brand: 'Stone&Co', stock: 120, rating: 4.4, numReviews: 189, featured: false, tags: ['bracelet', 'gemstone', 'jewelry'] },
  { name: 'Herschel Little America Backpack', price: 11500, originalPrice: 14000, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', description: '25L capacity, laptop sleeve, signature striped lining, durable poly.', brand: 'Herschel', stock: 30, rating: 4.7, numReviews: 234, featured: true, tags: ['backpack', 'herschel', 'travel'] },
  { name: 'Silk Scarf 90x90', price: 4500, originalPrice: 5800, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', description: '100% silk twill, hand-rolled edges, versatile style for neck or hair.', brand: 'SilkLux', stock: 45, rating: 4.5, numReviews: 78, featured: false, tags: ['scarf', 'silk', 'women'] },
  { name: 'Pebble Leather Belt', price: 2800, originalPrice: 3500, category: catMap['Accessories'], image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4de7?w=600', description: 'Full-grain pebble leather, solid brass buckle, 35mm width.', brand: 'BeltCo', stock: 70, rating: 4.4, numReviews: 45, featured: false, tags: ['belt', 'leather', 'men'] },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      Founder.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed categories
    const createdCats = await Category.insertMany(categories);
    const catMap = Object.fromEntries(createdCats.map(c => [c.name, c._id]));
    console.log(`✅ Created ${createdCats.length} categories`);

    // Seed admin user
    const adminPassword = await require('bcryptjs').hash(process.env.ADMIN_PASSWORD || 'Jeevan@Sabaisale', 12);
    const admin = await User.create({
      name: 'Jeevan Don',
      username: 'jeevandon',
      email: process.env.ADMIN_EMAIL || 'admin@sabaisale.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Seed products
    const products = getProducts(catMap);
    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    // Seed founders
    await Founder.insertMany(founders);
    console.log(`✅ Created ${founders.length} founders`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedDB();
