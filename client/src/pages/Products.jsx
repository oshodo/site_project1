// client/src/pages/Products.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low → High' },
  { value: '-price',     label: 'Price: High → Low' },
  { value: '-rating',    label: 'Best Rated' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]   = useState([]);
  const [categories,  setCategories] = useState([]);
  const [pagination,  setPagination] = useState({});
  const [loading,     setLoading]    = useState(true);

  // Filter state
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || '-createdAt');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { categoryAPI.getAll().then((r) => setCategories(r.data.data)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (search)   params.search   = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    setSearchParams(params);
    try {
      const res = await productAPI.getAll(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, search, category, sort, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };
  const handleClearFilters = () => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSort('-createdAt'); setPage(1); };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <p className="font-semibold mb-3 dark:text-white">Category</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="cat" checked={!category} onChange={() => { setCategory(''); setPage(1); }} className="accent-orange-500" />
            <span className="text-sm dark:text-gray-300">All Categories</span>
          </label>
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={category === c._id} onChange={() => { setCategory(c._id); setPage(1); }} className="accent-orange-500" />
              <span className="text-sm dark:text-gray-300">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-semibold mb-3 dark:text-white">Price Range (NPR)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="input text-sm" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="input text-sm" />
        </div>
        <button onClick={() => setPage(1)} className="mt-2 w-full text-sm btn-primary py-2">Apply</button>
      </div>

      <button onClick={handleClearFilters} className="w-full text-sm text-orange-500 hover:underline">Clear all filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold dark:text-white">All Products</h1>
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-sm">
            <input
              type="text" placeholder="Search products..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input flex-1 text-sm"
            />
            <button type="submit" className="btn-primary px-4 py-2 text-sm">🔍</button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* ── Desktop Sidebar ──────────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="card p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort + mobile filter */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button className="lg:hidden btn-outline text-sm px-3 py-2 flex items-center gap-1" onClick={() => setSidebarOpen(true)}>
                  ⚙️ Filters
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total || 0} products
                </p>
              </div>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="input text-sm w-auto">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="card animate-pulse overflow-hidden">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No products found</p>
                <button onClick={handleClearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">«</button>
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-4 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">← Prev</button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-xl text-sm border transition-colors ${page === i + 1 ? 'bg-orange-500 border-orange-500 text-white' : 'dark:border-gray-600 dark:text-white hover:border-orange-400'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage((p) => p + 1)} disabled={page === pagination.pages} className="px-4 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">Next →</button>
                <button onClick={() => setPage(pagination.pages)} disabled={page === pagination.pages} className="px-3 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">»</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white dark:bg-gray-900 w-72 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <p className="font-bold text-lg dark:text-white">Filters</p>
              <button onClick={() => setSidebarOpen(false)} className="text-2xl text-gray-400">×</button>
            </div>
            <FilterPanel />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Products;
