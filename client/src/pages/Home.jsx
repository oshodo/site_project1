import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Zap, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import { ProductCard, SkeletonCard, SectionHeader } from '../components/common/index';

const BANNERS = [
  { img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', title: 'Electronics Sale', sub: 'Up to 50% off on gadgets', link: '/products?category=Electronics', color: 'from-blue-900' },
  { img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', title: 'Fashion Week', sub: 'New arrivals daily', link: '/products?category=Fashion', color: 'from-purple-900' },
  { img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200', title: 'Home & Living', sub: 'Transform your space', link: '/products?category=Home', color: 'from-green-900' },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-600' },
  { name: 'Fashion', icon: '👗', color: 'bg-pink-50 dark:bg-pink-950', text: 'text-pink-600' },
  { name: 'Home', icon: '🏠', color: 'bg-green-50 dark:bg-green-950', text: 'text-green-600' },
  { name: 'Accessories', icon: '👜', color: 'bg-yellow-50 dark:bg-yellow-950', text: 'text-yellow-600' },
  { name: 'Sports', icon: '⚽', color: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-600' },
  { name: 'Books', icon: '📚', color: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-600' },
  { name: 'Beauty', icon: '💄', color: 'bg-rose-50 dark:bg-rose-950', text: 'text-rose-600' },
  { name: 'Computers', icon: '💻', color: 'bg-indigo-50 dark:bg-indigo-950', text: 'text-indigo-600' },
];

const FEATURES = [
  { icon: <Truck size={20} className="text-primary-500" />, title: 'Free Delivery', sub: 'On orders above NPR 5,000' },
  { icon: <Shield size={20} className="text-primary-500" />, title: '100% Secure', sub: 'Safe & encrypted payments' },
  { icon: <RotateCcw size={20} className="text-primary-500" />, title: 'Easy Returns', sub: '7-day hassle-free returns' },
  { icon: <Headphones size={20} className="text-primary-500" />, title: '24/7 Support', sub: 'Dedicated customer care' },
];

function FlashTimer() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-1 text-white">
      <span className="flash-timer">{String(time.h).padStart(2,'0')}</span>
      <span className="font-bold">:</span>
      <span className="flash-timer">{String(time.m).padStart(2,'0')}</span>
      <span className="font-bold">:</span>
      <span className="flash-timer">{String(time.s).padStart(2,'0')}</span>
    </div>
  );
}

function Banner() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const startTimer = () => { timerRef.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 4000); };
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);
  const go = (dir) => { clearInterval(timerRef.current); setIdx(i => (i + dir + BANNERS.length) % BANNERS.length); startTimer(); };
  const b = BANNERS[idx];
  return (
    <div className="relative h-48 md:h-72 rounded overflow-hidden bg-gray-900">
      <img src={b.img} alt={b.title} className="w-full h-full object-cover opacity-60 transition-all duration-500" />
      <div className={`absolute inset-0 bg-gradient-to-r ${b.color} to-transparent`} />
      <div className="absolute inset-0 flex items-center px-8">
        <div className="text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{b.title}</h2>
          <p className="text-sm md:text-base text-white/80 mb-4">{b.sub}</p>
          <Link to={b.link} className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded inline-block transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
      <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_,i) => <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i===idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />)}
      </div>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productsAPI.getFeatured(),
      productsAPI.getAll({ sort: 'newest', limit: 10 }),
    ]).then(([f, n]) => {
      setFeatured(f.data.products || []);
      setNewArrivals(n.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="container-custom pt-3 pb-4">
        <div className="grid md:grid-cols-4 gap-3">
          {/* Main Banner */}
          <div className="md:col-span-3"><Banner /></div>
          {/* Side Banners */}
          <div className="hidden md:flex flex-col gap-3">
            <div className="relative h-[calc(50%-6px)] rounded overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/products?featured=true')}>
              <div className="text-center text-white p-4">
                <Zap size={28} className="mx-auto mb-1" />
                <p className="font-bold text-sm">Flash Sale</p>
                <p className="text-xs opacity-80">Limited time deals</p>
              </div>
            </div>
            <div className="relative h-[calc(50%-6px)] rounded overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/products')}>
              <div className="text-center text-white p-4">
                <ShoppingBag size={28} className="mx-auto mb-1" />
                <p className="font-bold text-sm">New Arrivals</p>
                <p className="text-xs opacity-80">Shop latest items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="container-custom py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-2.5">
                {f.icon}
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{f.title}</p>
                  <p className="text-[10px] text-gray-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-4 space-y-5">
        {/* Categories */}
        <div className="bg-white dark:bg-gray-900 rounded p-4 border border-gray-200 dark:border-gray-800">
          <SectionHeader title="Shop by Category" link="/products" />
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}
                className={`${cat.color} rounded p-2 text-center hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <div className="text-2xl mb-1">{cat.icon}</div>
                <p className={`text-[10px] font-semibold ${cat.text} leading-tight`}>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Flash Sale */}
        <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-primary-500 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-yellow-300 fill-yellow-300" />
              <span className="text-white font-bold text-sm">FLASH SALE</span>
              <FlashTimer />
            </div>
            <Link to="/products?featured=true" className="text-white text-xs font-semibold hover:underline">
              See All &rsaquo;
            </Link>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {loading
                ? Array(5).fill(null).map((_, i) => <SkeletonCard key={i} />)
                : featured.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
              }
            </div>
          </div>
        </div>

        {/* Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { bg: 'from-blue-500 to-cyan-500', emoji: '💻', title: 'Electronics', sub: 'Best gadgets', link: '/products?category=Electronics' },
            { bg: 'from-pink-500 to-rose-500', emoji: '👗', title: 'Fashion', sub: 'Trendy styles', link: '/products?category=Fashion' },
            { bg: 'from-green-500 to-teal-500', emoji: '🏠', title: 'Home & Living', sub: 'Cozy essentials', link: '/products?category=Home' },
          ].map(b => (
            <Link key={b.title} to={b.link}
              className={`bg-gradient-to-r ${b.bg} rounded p-5 text-white flex items-center gap-4 hover:opacity-90 transition-opacity`}>
              <span className="text-4xl">{b.emoji}</span>
              <div>
                <p className="font-bold">{b.title}</p>
                <p className="text-xs opacity-80">{b.sub}</p>
                <p className="text-xs font-semibold mt-1 underline">Shop Now &rsaquo;</p>
              </div>
            </Link>
          ))}
        </div>

        {/* New Arrivals */}
        <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gray-800 dark:bg-gray-950 px-4 py-2.5 flex items-center justify-between">
            <span className="text-white font-bold text-sm">✨ NEW ARRIVALS</span>
            <Link to="/products?sort=newest" className="text-gray-300 text-xs hover:text-white hover:underline">See All &rsaquo;</Link>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {loading
                ? Array(5).fill(null).map((_, i) => <SkeletonCard key={i} />)
                : newArrivals.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
              }
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 p-4">
          <SectionHeader title="What Customers Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {[
              { name: 'Priya S.', text: 'Super fast delivery! Got my order in 2 days. Quality is excellent.', rating: 5 },
              { name: 'Arjun T.', text: 'Best online shopping experience in Nepal. Will definitely shop again!', rating: 5 },
              { name: 'Sita M.', text: 'Great products and amazing customer service. Highly recommended!', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                <div className="flex mb-1.5">
                  {Array(t.rating).fill(null).map((_, j) => <span key={j} className="text-yellow-400 text-xs">★</span>)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">"{t.text}"</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-primary-500 mt-4">
        <div className="container-custom py-8 text-center text-white">
          <h2 className="text-xl font-bold mb-1">Download Our App</h2>
          <p className="text-sm text-white/80 mb-4">Shop on the go — available soon on iOS & Android</p>
          <div className="flex gap-3 justify-center">
            <div className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 text-xs font-semibold cursor-pointer hover:bg-gray-900">
              🍎 App Store
            </div>
            <div className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 text-xs font-semibold cursor-pointer hover:bg-gray-900">
              🤖 Google Play
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
