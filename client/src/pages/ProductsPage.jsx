import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['Electronics', 'Computers', 'Footwear', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Accessories']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',   label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [pages, setPages]       = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state — sync with URL params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort:     searchParams.get('sort')     || 'newest',
    search:   searchParams.get('search')   || '',
    page:     Number(searchParams.get('page')) || 1,
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      const { data } = await api.get('/products', { params })
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Keep URL in sync
  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== 1))
    setSearchParams(params)
  }, [filters, setSearchParams])

  // Re-read search param when URL changes (e.g. from Navbar)
  useEffect(() => {
    const s = searchParams.get('search')
    const c = searchParams.get('category')
    if (s !== filters.search || c !== filters.category) {
      setFilters(f => ({ ...f, search: s || '', category: c || '', page: 1 }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('search'), searchParams.get('category')])

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }))
  const clearFilters = () => setFilters({ category: '', minPrice: '', maxPrice: '', sort: 'newest', search: '', page: 1 })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {filters.search ? `Results for "${filters.search}"` : filters.category || 'All Products'}
          </h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{total} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => set('sort', e.target.value)}
            className="input-field w-auto text-sm py-2 pr-8"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {/* Filter toggle (mobile) */}
          <button onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="card p-4 space-y-5 sticky top-24">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              {(filters.category || filters.minPrice || filters.maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-0.5">
                  <FiX size={11} /> Clear
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => set('category', '')}
                    className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-orange-50 ${!filters.category ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                    All Categories
                  </button>
                </li>
                {CATEGORIES.map(c => (
                  <li key={c}>
                    <button onClick={() => set('category', c)}
                      className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-orange-50 ${filters.category === c ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice}
                  onChange={e => set('minPrice', e.target.value)}
                  className="input-field text-xs py-1.5" />
                <input type="number" placeholder="Max" value={filters.maxPrice}
                  onChange={e => set('maxPrice', e.target.value)}
                  className="input-field text-xs py-1.5" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-700">No products found</h3>
              <p className="text-gray-400 mt-1">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button disabled={filters.page === 1}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                    Prev
                  </button>
                  {[...Array(pages)].map((_, i) => (
                    <button key={i}
                      onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                      className={`px-4 py-2 rounded-lg text-sm border ${filters.page === i + 1 ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={filters.page === pages}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
