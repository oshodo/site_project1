import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Headphones, Sparkles } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { ProductCard, SkeletonCard, SectionHeader } from '../components/common/index';

const BANNERS = [
  {
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400',
    eyebrow: 'New Collection',
    title: 'Premium Products\nDelivered to Nepal',
    sub: 'Authentic goods from top global brands, shipped directly to your door.',
    cta: 'Explore Collection',
    link: '/products',
  },
  {
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400',
    eyebrow: 'Electronics',
    title: 'Latest Tech\nBest Prices',
    sub: 'From Apple to Samsung — genuine products with warranty.',
    cta: 'Shop Electronics',
    link: '/products?category=Electronics',
  },
  {
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400',
    eyebrow: 'Fashion',
    title: 'Style That\nSpeaks for You',
    sub: 'Curated fashion from the world\'s leading brands.',
    cta: 'Shop Fashion',
    link: '/products?category=Fashion',
  },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '⌨️', sub: '150+ Products', link: '/products?category=Electronics' },
  { name: 'Fashion', icon: '👔', sub: '200+ Styles', link: '/products?category=Fashion' },
  { name: 'Home', icon: '🕯️', sub: '100+ Items', link: '/products?category=Home' },
  { name: 'Accessories', icon: '⌚', sub: '80+ Picks', link: '/products?category=Accessories' },
];

const FEATURES = [
  { icon: <Truck size={18} strokeWidth={1.5}/>, title: 'Free Shipping', sub: 'Orders over NPR 5,000' },
  { icon: <Shield size={18} strokeWidth={1.5}/>, title: '100% Authentic', sub: 'Genuine products only' },
  { icon: <RotateCcw size={18} strokeWidth={1.5}/>, title: 'Easy Returns', sub: '7-day return policy' },
  { icon: <Headphones size={18} strokeWidth={1.5}/>, title: '24/7 Support', sub: 'Always here to help' },
];

function FlashTimer() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      let { h, m, s } = p;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) h = 5;
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-1.5">
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="flash-timer">{String(v).padStart(2, '0')}</span>
          {i < 2 && <span className="text-white font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

function HeroBanner() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const start = () => { timer.current = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 5000); };
  useEffect(() => { start(); return () => clearInterval(timer.current); }, []);
  const go = (dir) => { clearInterval(timer.current); setIdx(i => (i + dir + BANNERS.length) % BANNERS.length); start(); };
  const b = BANNERS[idx];

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a]" style={{ height: 'min(480px, 60vw)', minHeight: '280px' }}>
      <img src={b.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-lg">
            <p className="section-label text-accent-400 mb-4" style={{ color: '#c8a96e' }}>
              <span style={{ background: '#c8a96e', display: 'inline-block', width: 20, height: 1, marginRight: 8, verticalAlign: 'middle' }} />
              {b.eyebrow}
            </p>
            <h1 className="text-white font-bold leading-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 52px)', whiteSpace: 'pre-line' }}>
              {b.title}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">{b.sub}</p>
            <div className="flex items-center gap-4">
              <Link to={b.link} className="btn-accent px-8 py-3 text-sm tracking-wide">
                {b.cta}
              </Link>
              <Link to="/products" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors group">
                Browse all <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all text-white" style={{ borderRadius: '2px' }}>
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all text-white" style={{ borderRadius: '2px' }}>
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`transition-all duration-300 rounded-full ${i === idx ? 'w-6 h-1.5 bg-accent-400' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsAPI.getFeatured(), productsAPI.getAll({ sort: 'newest', limit: 10 })])
      .then(([f, n]) => { setFeatured(f.data.products || []); setNewArrivals(n.data.products || []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <HeroBanner />

      {/* Features */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-[var(--border)]">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0" style={{ borderRadius: '2px' }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)] tracking-wide">{f.title}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-12 space-y-16">
        {/* Categories */}
        <section>
          <SectionHeader label="Browse" title="Shop by Category" link="/products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={cat.link}
                className="group bg-white dark:bg-[#141414] border border-[var(--border)] p-6 text-center hover:border-[var(--text)] transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                style={{ borderRadius: '2px' }}>
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{cat.icon}</div>
                <p className="text-sm font-bold text-[var(--text)] tracking-wide">{cat.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">{cat.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label mb-2">Limited Time</p>
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">Flash Sale</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Ends in</span>
                  <FlashTimer />
                </div>
              </div>
            </div>
            <Link to="/products?featured=true" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors group">
              View All <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {loading ? Array(10).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : featured.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>

        {/* Editorial Banner */}
        <section className="grid md:grid-cols-2 gap-3">
          {[
            { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800', tag: 'Sport & Fitness', title: 'Move with Purpose', sub: 'Premium activewear & gear', link: '/products?category=Fashion', dark: true },
            { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', tag: 'Home & Living', title: 'Elevate Your Space', sub: 'Curated home essentials', link: '/products?category=Home', dark: false },
          ].map(b => (
            <Link key={b.title} to={b.link}
              className="relative overflow-hidden group block h-52"
              style={{ borderRadius: '2px' }}>
              <img src={b.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className={`absolute inset-0 ${b.dark ? 'bg-gradient-to-r from-[#0a0a0a]/80 to-transparent' : 'bg-gradient-to-t from-[#0a0a0a]/80 to-transparent'}`} />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[10px] text-accent-300 font-bold tracking-widest uppercase mb-1">{b.tag}</p>
                <h3 className="text-white font-bold text-lg tracking-tight">{b.title}</h3>
                <p className="text-white/60 text-xs mt-0.5 mb-3">{b.sub}</p>
                <span className="text-white text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Shop Now <ArrowRight size={12} strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* New Arrivals */}
        <section>
          <SectionHeader label="Just In" title="New Arrivals" link="/products?sort=newest" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {loading ? Array(10).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : newArrivals.slice(0, 10).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>

        {/* Why Us */}
        <section className="bg-[#111111] dark:bg-[#0a0a0a] border border-[#222222] text-white p-10 md:p-16 text-center" style={{ borderRadius: '2px' }}>
          <Sparkles size={24} className="text-accent-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Nepal's Most Trusted<br />Premium Store</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-8">
            We source directly from authorized distributors worldwide, ensuring every product is 100% authentic and backed by warranty.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[['10,000+', 'Happy Customers'], ['500+', 'Premium Products'], ['4.9★', 'Average Rating'], ['2 Days', 'Avg. Delivery']].map(([num, label]) => (
              <div key={label}>
                <p className="text-accent-400 font-bold text-xl">{num}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
