// client/src/pages/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { categoryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState({ name: '', description: '' });
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try { const res = await categoryAPI.getAll(); setCategories(res.data.data); }
    catch (err) { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await categoryAPI.update(editId, form);
        toast.success('Category updated');
      } else {
        await categoryAPI.create(form);
        toast.success('Category created');
      }
      setForm({ name: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleEdit = (cat) => { setEditId(cat._id); setForm({ name: cat.name, description: cat.description }); };
  const handleCancel = () => { setEditId(null); setForm({ name: '', description: '' }); };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this category?')) return;
    try { await categoryAPI.remove(id); toast.success('Category removed'); fetchCategories(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4 dark:text-white">{editId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Name *</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="input" placeholder="e.g. Electronics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input resize-none" />
            </div>
            <div className="flex gap-2">
              {editId && <button type="button" onClick={handleCancel} className="flex-1 btn-outline text-sm py-2">Cancel</button>}
              <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2">
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 card overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Slug</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 font-medium dark:text-white">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{cat.description || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 font-medium mr-3">Edit</button>
                      <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {categories.length === 0 && !loading && <div className="text-center py-12 text-gray-400">No categories yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
