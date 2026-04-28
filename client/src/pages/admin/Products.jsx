import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, Filter, Image, Tag, Star, Package } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', price:'', originalPrice:'', category:'', brand:'', stock:'', image:'', images:'', tags:'', featured:false, isActive:true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [tab, setTab] = useState('basic');

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([productsAPI.getAll({ limit: 200 }), categoriesAPI.getAll()]);
    setProducts(p.data.products || []);
    setCategories(c.data.categories || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setTab('basic'); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice || ''), stock: String(p.stock),
      category: p.category?._id || p.category, images: p.images?.join(', ') || '', tags: p.tags?.join(', ') || '' });
    setEditId(p._id); setTab('basic'); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock), images: form.images.split(',').map(s=>s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editId) await productsAPI.update(editId, payload);
      else await productsAPI.create(payload);
      toast.success(editId ? 'Product updated!' : 'Product created!');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await productsAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }));

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category?._id === catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const discount = form.price && form.originalPrice ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Products</h1>
          <p className="text-xs text-gray-500">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-xs py-2">
          <Plus size={14}/> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="input-field pl-8 py-2 text-xs" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field py-2 text-xs w-auto">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <Package size={32} className="mx-auto text-gray-300 mb-2"/>
                  <p className="text-gray-400 text-xs">No products found</p>
                  <button onClick={openAdd} className="btn-primary text-xs py-1.5 px-3 mt-2">Add First Product</button>
                </td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={p.image || p.images?.[0] || 'https://placehold.co/40'} alt=""
                        className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0 border border-gray-200"/>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 max-w-[160px] truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{p.category?.name || '—'}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">NPR {p.price?.toLocaleString()}</p>
                    {p.originalPrice > p.price && <p className="text-[10px] text-gray-400 line-through">NPR {p.originalPrice?.toLocaleString()}</p>}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{p.stock} left</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {p.featured ? <span className="text-yellow-500 text-xs">⭐ Yes</span> : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded transition-colors" title="Edit">
                        <Edit2 size={13}/>
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors" title="Delete">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-[10px] text-gray-500">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">{editId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={16}/></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-5">
              {[['basic', 'Basic Info'], ['media', 'Images & Tags'], ['inventory', 'Inventory']].map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px ${tab===t ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-5">
                {tab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Product Name *</label>
                      <input required value={form.name} onChange={set('name')} placeholder="e.g. iPhone 15 Pro Max" className="input-field text-sm"/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description *</label>
                      <textarea required rows={3} value={form.description} onChange={set('description')} className="input-field text-sm resize-none" placeholder="Describe the product..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Sale Price (NPR) *</label>
                        <input type="number" required value={form.price} onChange={set('price')} className="input-field text-sm" placeholder="0"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Original Price (NPR)</label>
                        <input type="number" value={form.originalPrice} onChange={set('originalPrice')} className="input-field text-sm" placeholder="0"/>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                        <Tag size={13} className="text-green-600"/>
                        <span className="text-xs text-green-700 dark:text-green-400 font-semibold">{discount}% discount will be shown to customers</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category *</label>
                        <select required value={form.category} onChange={set('category')} className="input-field text-sm">
                          <option value="">Select category</option>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Brand</label>
                        <input value={form.brand} onChange={set('brand')} className="input-field text-sm" placeholder="Apple, Samsung..." />
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'media' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Main Image URL</label>
                      <input value={form.image} onChange={set('image')} className="input-field text-sm" placeholder="https://images.unsplash.com/..." />
                      {form.image && <img src={form.image} alt="" className="mt-2 h-24 w-24 object-cover rounded border border-gray-200" />}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Additional Images (comma-separated)</label>
                      <textarea value={form.images} onChange={set('images')} rows={2} className="input-field text-sm resize-none"
                        placeholder="https://url1.jpg, https://url2.jpg, https://url3.jpg" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Tags (comma-separated)</label>
                      <input value={form.tags} onChange={set('tags')} className="input-field text-sm" placeholder="electronics, smartphone, apple" />
                      <p className="text-[10px] text-gray-400 mt-1">Tags help customers find your product</p>
                    </div>
                  </div>
                )}

                {tab === 'inventory' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Stock Quantity *</label>
                      <input type="number" required value={form.stock} onChange={set('stock')} className="input-field text-sm" placeholder="0"/>
                      {form.stock && Number(form.stock) <= 10 && Number(form.stock) > 0 && (
                        <p className="text-xs text-amber-500 mt-1">⚠️ Low stock warning will show to customers</p>
                      )}
                      {form.stock && Number(form.stock) === 0 && (
                        <p className="text-xs text-red-500 mt-1">❌ Product will show as Out of Stock</p>
                      )}
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:border-primary-300 transition-colors">
                        <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-primary-500 rounded"/>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">⭐ Featured Product</p>
                          <p className="text-[10px] text-gray-400">Show in Flash Sale and homepage featured section</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:border-primary-300 transition-colors">
                        <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="w-4 h-4 accent-primary-500 rounded"/>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">✅ Active (Visible)</p>
                          <p className="text-[10px] text-gray-400">Product is visible to customers in the store</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 px-5 py-3.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                {tab !== 'basic' && <button type="button" onClick={() => setTab(tab==='inventory'?'media':'basic')} className="btn-ghost text-xs py-2">← Back</button>}
                {tab !== 'inventory' ? (
                  <button type="button" onClick={() => setTab(tab==='basic'?'media':'inventory')} className="btn-primary text-xs py-2 ml-auto">
                    Next →
                  </button>
                ) : (
                  <button type="submit" disabled={saving} className="btn-primary text-xs py-2 ml-auto flex items-center gap-1.5">
                    <Save size={13}/>{saving ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
