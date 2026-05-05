// client/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const HERO_SLIDES = [
  { title: 'New Season Arrivals',   sub: 'Discover the latest gadgets & fashion',     bg: 'from-orange-500 to-pink-500',    emoji: '🚀' },
  { title: 'Free Shipping Over ₹2000', sub: 'Shop more, save more on delivery!',       bg: 'from-blue-500 to-purple-600',    emoji: '🚚' },
  { title: 'Up to 50% OFF Today',   sub: 'Limited time deals on top products',         bg: 'from-green-500 to-teal-500',     emoji: '🎉' },
];

const Home = () => {
  const [featured,    setFeatured]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [slide,       setSlide]       = useState(0);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ featured: 'true', limit: 8 }),
      categoryAPI.getAll(),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.data);
      setCategories(cRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* ── Hero Banner ────────────────────────────────────── */}
      <section className={`bg-gradient-to-r ${current.bg} text-white py-20 px-4 transition-all duration-700`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">{current.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-sm">{current.title}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">{current.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Shop Now →
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Join Free
            </Link>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === slide ? 'bg-white w-6' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm font-medium">
          {[['🚚', 'Free Delivery', 'Orders above NPR 2000'], ['🔒', 'Secure Payment', '100% protected'], ['↩️', 'Easy Returns', '7-day return policy'], ['🎧', '24/7 Support', 'Always here for you']].map(([icon, title, sub]) => (
            <div key={title}>
              <span className="text-2xl">{icon}</span>
              <p className="font-semibold mt-1">{title}</p>
              <p className="text-orange-100 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* ── Categories ─────────────────────────────────── */}
        {categories.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold dark:text-white mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/products?category=${cat._id}`}
                  className="card p-6 text-center hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-700 transition-all group cursor-pointer">
                  <div className="text-4xl mb-3">
                    {cat.image ? <img src={cat.image} alt={cat.name} className="w-12 h-12 mx-auto object-cover rounded-xl" /> : '📦'}
                  </div>
                  <p className="font-semibold dark:text-white group-hover:text-orange-500 transition-colors">{cat.name}</p>
                  {cat.description && <p className="text-xs text-gray-400 mt-1">{cat.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured Products ──────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">⭐ Featured Products</h2>
            <Link to="/products" className="text-orange-500 font-medium hover:underline text-sm">View all →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* ── CTA Banner ─────────────────────────────────── */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-3">Ready to start shopping?</h2>
          <p className="text-gray-300 mb-6">Join thousands of happy customers across Nepal</p>
          <Link to="/products" className="bg-orange-500 hover:bg-orange-600 font-bold px-8 py-3 rounded-xl transition-colors">
            Browse All Products
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
