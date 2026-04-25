import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { name: 'Electronics',    emoji: '📱', color: 'bg-blue-50 text-blue-700' },
  { name: 'Computers',      emoji: '💻', color: 'bg-purple-50 text-purple-700' },
  { name: 'Footwear',       emoji: '👟', color: 'bg-green-50 text-green-700' },
  { name: 'Clothing',       emoji: '👕', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'bg-red-50 text-red-700' },
  { name: 'Sports',         emoji: '⚽', color: 'bg-orange-50 text-orange-700' },
  { name: 'Books',          emoji: '📚', color: 'bg-teal-50 text-teal-700' },
  { name: 'Accessories',    emoji: '🕶️', color: 'bg-pink-50 text-pink-700' },
]

const FEATURES = [
  { icon: FiTruck,      title: 'Free Shipping',    desc: 'On orders over $100' },
  { icon: FiShield,     title: 'Secure Payment',   desc: '100% secure checkout' },
  { icon: FiRefreshCw,  title: 'Easy Returns',     desc: '30-day return policy' },
  { icon: FiHeadphones, title: '24/7 Support',     desc: 'Always here to help' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="badge bg-orange-500/20 text-orange-400 mb-4 inline-block">New Arrivals 2025</span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Shop the Best<br /><span className="text-orange-500">Deals Online</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Discover thousands of products from top brands with fast delivery and hassle-free returns.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products?category=Electronics" className="btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-600 inline-flex items-center gap-2">
                View Deals
              </Link>
            </div>
            <div className="flex gap-6 mt-8 text-sm text-gray-400">
              <span><strong className="text-white">50K+</strong> Products</span>
              <span><strong className="text-white">10K+</strong> Customers</span>
              <span><strong className="text-white">99%</strong> Satisfaction</span>
            </div>
          </div>
          <div className="hidden md:block flex-1 text-center text-[120px]">🛍️</div>
        </div>
      </section>

      {/* ── Feature Badges ── */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-xl p-3 text-center hover:scale-105 transition-transform`}
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <p className="text-xs font-medium leading-tight">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Promo Banner ── */}
      <section className="bg-orange-500 text-white py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Special Offer — Up to 50% Off!</h2>
        <p className="mb-6 text-orange-100">Limited time deals. Don't miss out.</p>
        <Link to="/products" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors inline-block">
          Explore Deals
        </Link>
      </section>
    </div>
  )
}
