import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react';
import { productsAPI, categoriesAPI, uploadAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', image: '', images: '', tags: '', featured: false, isActive: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([productsAPI.getAll({ limit: 200 }), categoriesAPI.getAll()]);
    setProducts(p.data.products);
    setCategories(c.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice || ''), stock: String(p.stock), category: p.category?._id || p.category, images: p.images?.join(', ') || '', tags: p.tags?.join(', ') || '' });
    setEditId(p._id); setModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const { data } = await uploadAPI.upload(fd);
      setForm(f => ({ ...f, image: data.url }));
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed — check Cloudinary config'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editId) await productsAPI.update(editId, payload);
      else await productsAPI.create(payload);
      toast.success(editId ? 'Product updated!' : 'Product created!');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await productsAPI.delete(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.type === 'checkbox' ? e.target.checked : e.target.value }));
  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Products</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="input-field pl-10 py-2.5 text-sm" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-[var(--text-muted)] uppercase tracking-wide">
              <tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--text-muted)]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--text-muted)]">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image || p.images?.[0] || 'https://placehold.co/40'} alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[var(--text)] max-w-[180px] truncate">{p.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{p.category?.name}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--text)]">NPR {p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-500 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModal(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-card)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)] z-10">
                <h3 className="font-display text-lg font-bold text-[var(--text)]">{editId ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Product Name *', type: 'text', col: 'col-span-2' },
                  { key: 'price', label: 'Price (NPR) *', type: 'number' },
                  { key: 'originalPrice', label: 'Original Price', type: 'number' },
                  { key: 'brand', label: 'Brand', type: 'text' },
                  { key: 'stock', label: 'Stock *', type: 'number' },
                ].map(f => (
                  <div key={f.key} className={f.col || ''}>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">{f.label}</label>
                    <input type={f.type} required={f.label.includes('*')} value={form[f.key]} onChange={set(f.key)} className="input-field text-sm" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Category *</label>
                  <select value={form.category} onChange={set('category')} required className="input-field text-sm">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Upload Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-[var(--text-muted)] w-full" />
                  {uploading && <p className="text-xs text-primary-500 mt-1">Uploading...</p>}
                  {form.image && <img src={form.image} alt="" className="mt-2 w-16 h-16 rounded-xl object-cover" />}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Image URL</label>
                  <input type="text" value={form.image} onChange={set('image')} placeholder="https://..." className="input-field text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Additional Images (comma-separated URLs)</label>
                  <input type="text" value={form.images} onChange={set('images')} placeholder="https://..., https://..." className="input-field text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Description *</label>
                  <textarea rows={3} required value={form.description} onChange={set('description')} className="input-field text-sm resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={set('tags')} placeholder="electronics, laptop, apple" className="input-field text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-primary-500 rounded" />
                  <label htmlFor="featured" className="text-sm text-[var(--text)]">Featured Product</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="active" checked={form.isActive} onChange={set('isActive')} className="w-4 h-4 accent-primary-500 rounded" />
                  <label htmlFor="active" className="text-sm text-[var(--text)]">Active (visible)</label>
                </div>
                <div className="col-span-2 flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Save size={15} />{saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
