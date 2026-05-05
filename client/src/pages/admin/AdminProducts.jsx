// ============================================================
// client/src/pages/admin/AdminProducts.jsx
// Full CRUD for products with Cloudinary image upload
// ============================================================
import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../utils/api';
import ImageUpload from '../../components/common/ImageUpload';

// ─── Product Form Modal ───────────────────────────────────────
const ProductModal = ({ product, categories, onSave, onClose }) => {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name:          product?.name          || '',
    description:   product?.description   || '',
    price:         product?.price         || '',
    originalPrice: product?.originalPrice || '',
    category:      product?.category?._id || product?.category || '',
    stock:         product?.stock         || '',
    brand:         product?.brand         || '',
    isFeatured:    product?.isFeatured    || false,
    images:        product?.images        || [],
  });

  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = (imgs) => setForm((prev) => ({ ...prev, images: imgs }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (form.images.length === 0) {
      setError('Please upload at least one product image.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock:         Number(form.stock),
      };

      if (isEdit) {
        await productAPI.update(product._id, payload);
      } else {
        await productAPI.create(payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Product Images *</label>
            <ImageUpload
              onUpload={handleImages}
              multiple
              existingImages={form.images}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Product Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Samsung Galaxy A54"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required rows={3}
              className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white resize-none"
            />
          </div>

          {/* Price + Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Price (NPR) *</label>
              <input
                name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Original Price (NPR)</label>
              <input
                name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} min="0"
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
                placeholder="For discount display"
              />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Category *</label>
              <select
                name="category" value={form.category} onChange={handleChange} required
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Stock *</label>
              <input
                name="stock" type="number" value={form.stock} onChange={handleChange} required min="0"
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Brand</label>
            <input
              name="brand" value={form.brand} onChange={handleChange}
              className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" name="isFeatured"
              checked={form.isFeatured} onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm dark:text-white">Featured product (shown on homepage)</span>
          </label>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
const AdminProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null); // null | 'add' | product object
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ page, limit: 10, search, isActive: true });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await categoryAPI.getAll();
    setCategories(res.data.data);
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await productAPI.remove(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Products</h1>
        <button
          onClick={() => setModal('add')}
          className="bg-orange-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-orange-600 flex items-center gap-2"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search products..."
        value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="border dark:border-gray-600 rounded-xl px-4 py-2 w-full max-w-sm dark:bg-gray-800 dark:text-white"
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Stock</th>
                  <th className="text-center px-4 py-3">Featured</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://placehold.co/48x48'}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium dark:text-white truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 dark:text-gray-300">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-right dark:text-white font-medium">
                      NPR {p.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${p.stock < 10 ? 'text-red-500' : 'dark:text-white'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isFeatured ? '⭐' : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(p)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-400">No products found.</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages} · {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          categories={categories}
          onSave={() => { setModal(null); fetchProducts(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminProducts;
