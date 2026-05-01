require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  { name: 'Jeevan Shakya', role: 'CEO & Co-Founder', bio: 'Visionary entrepreneur with a passion for connecting Nepali consumers with premium products.', image: 'https://raw.githubusercontent.com/oshodo/site_project1/main/jeevan.jpg', order: 1 },
  { name: 'Sabin Subedi', role: 'CTO & Co-Founder', bio: 'Full-stack developer who built SabaiSale from the ground up. Passionate about seamless digital experiences.', image: 'https://raw.githubusercontent.com/oshodo/site_project1/main/sabin.jpg', order: 2 },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Founder.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    const createdCats = await Category.insertMany(categories);
    const catMap = Object.fromEntries(createdCats.map(c => [c.name, c._id]));
    console.log(`✅ Created ${createdCats.length} categories`);

    const adminPass = await bcrypt.hash('Jeevan@Sabaisale', 12);
    await User.create({ name: 'Jeevan Shakya', username: 'jeevanshakya', email: 'jeevan@sabaisale.com', password: adminPass, role: 'admin' });
    console.log('✅ Admin created: jeevan@sabaisale.com');

    await Founder.insertMany(founders);
    console.log('✅ Founders created');

    console.log('\n🎉 Seed complete! Now run add-products.ps1 to add products.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}
seedDB();
