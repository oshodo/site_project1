import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RotateCcw, Headphones, Zap } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import { ProductCard, SkeletonCard, SectionHeader } from '../components/common/index';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
];

const features = [
  { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On orders above NPR 5,000' },
  { icon: <Shield size={22} />, title: 'Secure Payments', desc: 'eSewa, Khalti, COD accepted' },
  { icon: <RotateCcw size={22} />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Always here to help you' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([productsAPI.getFeatured(), categoriesAPI.getAll()])
      .then(([p, c]) => {
        setFeatured(p.data.products);
        setCategories(c.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-950">
        {/* BG Image */}
        {HERO_IMAGES.map((src, i) => (
          <motion.div key={src} className="absolute inset-0"
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover opacity-30" />
          </motion.div>
        ))}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-40 w-48 h-48 bg-orange-300/10 rounded-full blur-3xl animate-float" />

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/40 text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap size={14} fill="currentColor" />
                Nepal's #1 Premium Store
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-display text-5xl md:text-7xl font-bold text-white leading-none mb-6"
            >
              Shop<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">
                Premium.
              </span><br />
              Shop Smart.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed"
            >
              Discover thousands of authentic products — from cutting-edge electronics to premium fashion. Delivered to your doorstep in Nepal.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/products')}
                className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8"
              >
                <ShoppingBag size={18} />
                Explore Products
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/about')}
                className="btn-secondary border-white/30 text-white hover:bg-white hover:text-gray-900 flex items-center justify-center gap-2 text-base py-4 px-8"
              >
                Our Story <ArrowRight size={18} />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-8 mt-12"
            >
              {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-white">{num}</div>
                  <div className="text-sm text-gray-400">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === heroIdx ? 'w-8 bg-primary-500' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* ─── Features Bar ─────────────────────────────────────────────────── */}
      <section className="bg-primary-500">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="flex items-center gap-3 py-2"
              >
                <div className="text-white/80">{f.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-white/70 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-custom">
          <SectionHeader eyebrow="Browse By" title="Shop Categories" subtitle="Find exactly what you're looking for from our curated collections." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {(loading ? Array(4).fill(null) : categories).map((cat, i) => (
              cat ? (
                <motion.div key={cat._id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                >
                  <Link to={`/products?category=${cat._id}`}
                    className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-gray-800"
                  >
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="text-3xl mb-1">{cat.icon}</div>
                      <h3 className="font-display text-xl font-bold text-white">{cat.name}</h3>
                      <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                        Shop now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div key={i} className="skeleton rounded-2xl aspect-[4/3]" />
              )
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader eyebrow="Hand Picked" title="Featured Products" subtitle="Our most loved items, curated for you." centered={false} />
            <Link to="/products?featured=true" className="hidden md:flex items-center gap-2 text-primary-500 font-semibold hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : featured.slice(0, 8).map((product, i) => <ProductCard key={product._id} product={product} index={i} />)
            }
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/products" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ─── Banner ───────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gray-950 min-h-[300px] flex items-center"
          >
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400" alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 to-transparent" />
            <div className="relative z-10 p-10 md:p-16 max-w-xl">
              <span className="badge bg-primary-500 text-white mb-4">Limited Offer</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Up to <span className="text-primary-400">50% Off</span><br />on Electronics
              </h2>
              <p className="text-gray-300 mb-6">Shop the biggest sale of the season. Limited stock available.</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/products?category=electronics')}
                className="btn-primary flex items-center gap-2"
              >
                Shop Electronics <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <SectionHeader eyebrow="Reviews" title="What Our Customers Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { name: 'Priya Shrestha', role: 'Verified Buyer', text: 'Absolutely love SabaiSale! Super fast delivery and the products are exactly as described. Will definitely shop again!', rating: 5 },
              { name: 'Arjun Thapa', role: 'Verified Buyer', text: 'Best shopping experience in Nepal. The MacBook I ordered arrived in perfect condition and ahead of schedule!', rating: 5 },
              { name: 'Sita Maharjan', role: 'Verified Buyer', text: 'Amazing selection and incredible customer service. They helped me pick the perfect gift for my husband.', rating: 5 },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex mb-3">
                  {Array(t.rating).fill(null).map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-500 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--text)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
