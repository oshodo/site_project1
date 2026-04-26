import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import { ProductCard, SkeletonCard, Pagination, EmptyState } from '../components/common/index';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => { categoriesAPI.getAll().then(r => setCategories(r.data.categories)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (e) { setProducts([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== 1) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters]);

  // Sync URL search param on external navigation
  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    setFilters(f => ({ ...f, search: s || '', category: c || '', page: 1 }));
  }, [searchParams.get('search'), searchParams.get('category')]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));
  const clearFilters = () => setFilters({ category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '', featured: '', page: 1 });

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search || filters.featured;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Clear */}
      {hasActiveFilters && (
        <button onClick={clearFilters} className="flex items-center gap-1.5 text-primary-500 text-sm font-semibold hover:text-primary-600">
          <X size={14} /> Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-[var(--text)] mb-3 text-sm uppercase tracking-wide">Category</h4>
        <div className="space-y-1">
          <button onClick={() => setFilter('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-semibold' : 'text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >All Categories</button>
          {categories.map(cat => (
            <button key={cat._id} onClick={() => setFilter('category', cat._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat._id ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-semibold' : 'text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >{cat.icon} {cat.name}</button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-[var(--text)] mb-3 text-sm uppercase tracking-wide">Price Range (NPR)</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilter('minPrice', e.target.value)}
            className="input-field text-sm py-2"
          />
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilter('maxPrice', e.target.value)}
            className="input-field text-sm py-2"
          />
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.featured === 'true'} onChange={e => setFilter('featured', e.target.checked ? 'true' : '')}
            className="w-4 h-4 accent-primary-500 rounded"
          />
          <span className="text-sm text-[var(--text)]">Featured only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom mt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--text)]">
              {filters.search ? `"${filters.search}"` : filters.category ? categories.find(c => c._id === filters.category)?.name || 'Products' : 'All Products'}
            </h1>
            {!loading && (
              <p className="text-[var(--text-muted)] text-sm mt-1">{pagination.total} product{pagination.total !== 1 ? 's' : ''} found</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
                className="input-field py-2.5 pr-10 text-sm appearance-none cursor-pointer min-w-[170px]"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            </div>
            {/* Filter toggle mobile */}
            <button onClick={() => setFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 btn-ghost py-2.5 text-sm"
            >
              <SlidersHorizontal size={16} /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array(12).fill(null).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No products found"
                message="Try adjusting your filters or search term."
                action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>
                <Pagination currentPage={filters.page} totalPages={pagination.pages}
                  onPageChange={p => setFilters(f => ({ ...f, page: p }))}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--bg)] z-50 p-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-[var(--text)]">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
