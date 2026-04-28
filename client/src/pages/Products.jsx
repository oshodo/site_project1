import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid, List } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import { ProductCard, SkeletonCard, Pagination, SectionHeader } from '../components/common/index';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { label: 'Under NPR 5,000', min: '', max: '5000' },
  { label: 'NPR 5,000 – 15,000', min: '5000', max: '15000' },
  { label: 'NPR 15,000 – 50,000', min: '15000', max: '50000' },
  { label: 'NPR 50,000 – 1,00,000', min: '50000', max: '100000' },
  { label: 'Above NPR 1,00,000', min: '100000', max: '' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => { categoriesAPI.getAll().then(r => setCategories(r.data.categories || [])); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== 1) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters]);

  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s !== filters.search || c !== filters.category) {
      setFilters(f => ({ ...f, search: s || '', category: c || '', page: 1 }));
    }
  }, [searchParams.get('search'), searchParams.get('category')]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));
  const clearAll = () => setFilters({ category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '', featured: '', page: 1 });

  const hasFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search || filters.featured;
  const catName = categories.find(c => c._id === filters.category)?.name;

  const FilterPanel = () => (
    <div className="space-y-5">
      {hasFilters && (
        <button onClick={clearAll} className="flex items-center gap-1 text-xs text-primary-500 font-semibold hover:underline">
          <X size={12}/> Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Category</h4>
        <div className="space-y-1">
          <button onClick={() => setFilter('category', '')}
            className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${!filters.category ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat._id} onClick={() => setFilter('category', cat._id)}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${filters.category === cat._id ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Price Range</h4>
        <div className="space-y-1">
          {PRICE_RANGES.map(r => {
            const active = filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <button key={r.label} onClick={() => { setFilter('minPrice', r.min); setFilters(f => ({ ...f, maxPrice: r.max, page: 1 })); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${active ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {r.label}
              </button>
            );
          })}
          {/* Custom Range */}
          <div className="flex gap-1.5 mt-2">
            <input type="number" placeholder="Min" value={filters.minPrice}
              onChange={e => setFilter('minPrice', e.target.value)}
              className="input-field text-xs py-1.5 px-2"/>
            <input type="number" placeholder="Max" value={filters.maxPrice}
              onChange={e => setFilter('maxPrice', e.target.value)}
              className="input-field text-xs py-1.5 px-2"/>
          </div>
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-400">
        <input type="checkbox" checked={filters.featured === 'true'}
          onChange={e => setFilter('featured', e.target.checked ? 'true' : '')}
          className="w-3.5 h-3.5 accent-primary-500 rounded"/>
        ⭐ Featured products only
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="container-custom py-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <a href="/" className="hover:text-primary-500">Home</a>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{catName || filters.search ? `"${filters.search || catName}"` : 'All Products'}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-3 gap-3">
          <div>
            <h1 className="text-base font-bold text-gray-800 dark:text-gray-100">
              {filters.search ? `Results for "${filters.search}"` : catName || 'All Products'}
            </h1>
            {!loading && <p className="text-xs text-gray-500">{pagination.total} products found</p>}
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
                className="input-field py-1.5 pr-8 text-xs appearance-none cursor-pointer min-w-[150px]">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
            {/* View Mode */}
            <div className="hidden md:flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode==='grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Grid size={14}/></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode==='list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><List size={14}/></button>
            </div>
            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(true)} className="md:hidden flex items-center gap-1.5 btn-ghost text-xs py-1.5 relative">
              <SlidersHorizontal size={13}/> Filters
              {hasFilters && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"/>}
            </button>
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {filters.category && <span className="flex items-center gap-1 bg-primary-100 dark:bg-primary-950 text-primary-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {catName} <button onClick={() => setFilter('category', '')}><X size={10}/></button>
            </span>}
            {(filters.minPrice || filters.maxPrice) && <span className="flex items-center gap-1 bg-primary-100 dark:bg-primary-950 text-primary-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              NPR {filters.minPrice||'0'} – {filters.maxPrice||'∞'}
              <button onClick={() => setFilters(f => ({ ...f, minPrice:'', maxPrice:'', page:1 }))}><X size={10}/></button>
            </span>}
            {filters.featured && <span className="flex items-center gap-1 bg-primary-100 dark:bg-primary-950 text-primary-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Featured <button onClick={() => setFilter('featured', '')}><X size={10}/></button>
            </span>}
          </div>
        )}

        <div className="flex gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-3 ${viewMode==='grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {Array(12).fill(null).map((_, i) => <SkeletonCard key={i}/>)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center py-16 px-4">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearAll} className="btn-primary text-xs py-2 px-4">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-3 ${viewMode==='grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i}/>)}
                </div>
                <Pagination currentPage={filters.page} totalPages={pagination.pages}
                  onPageChange={p => setFilters(f => ({ ...f, page: p }))}/>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setFiltersOpen(false)}/>
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 z-50 p-5 overflow-y-auto md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={16}/></button>
            </div>
            <FilterPanel />
            <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full mt-4 text-xs py-2.5">Apply Filters</button>
          </div>
        </>
      )}
    </div>
  );
}
// In Products.jsx
import { sampleProducts } from 'C:\Users\G_WoN\Desktop\Sabaisale\client\src\data\sampleProducts.js';

const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await productsAPI.getAll(params);
    setProducts(data.products || []);
    setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
  } catch (error) {
    console.error('API failed, using sample data:', error);
    // Filter sample products based on current filters
    let filtered = [...sampleProducts];
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setProducts(filtered);
    setPagination({ page: 1, pages: 1, total: filtered.length });
  } finally {
    setLoading(false);
  }
}, [filters]);