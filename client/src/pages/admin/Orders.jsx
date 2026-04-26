import { useState, useEffect } from 'react';
import { ordersAPI, adminAPI, categoriesAPI, foundersAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const STATUS_COLOR = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// ─── Orders ───────────────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminAPI.getOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-[var(--text)]">Orders</h2>
      <div className="flex flex-wrap gap-2">
        {['', ...STATUSES].map(s => {
          const count = s ? orders.filter(o => o.status === s).length : orders.length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${filter === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300'}`}
            >{s || 'All'} ({count})</button>
          );
        })}
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-[var(--text-muted)] uppercase tracking-wide">
              <tr>{['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? <tr><td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">Loading...</td></tr>
                : filtered.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--text)]">#{order._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text)] text-sm">{order.user?.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{order.items?.length}</td>
                    <td className="px-4 py-3 font-bold text-[var(--text)]">NPR {order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs capitalize ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border-0 cursor-pointer ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getUsers().then(r => setUsers(r.data.users)).finally(() => setLoading(false)); }, []);

  const toggleRole = async (id, role) => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await adminAPI.updateUser(id, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch { toast.error('Update failed'); }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-[var(--text)]">Users</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-[var(--text-muted)] uppercase tracking-wide">
              <tr>{['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">Loading...</td></tr>
                : users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${u.role === 'admin' ? 'bg-primary-100 dark:bg-primary-950 text-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--text)]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${u.role === 'admin' ? 'bg-primary-100 dark:bg-primary-950 text-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggleRole(u._id, u.role)} title="Toggle role"
                          className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >{u.role === 'admin' ? '→ User' : '→ Admin'}</button>
                        <button onClick={() => deleteUser(u._id, u.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { categoriesAPI.getAll().then(r => setCats(r.data.categories)); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await categoriesAPI.update(editId, form); setCats(p => p.map(c => c._id === editId ? data.category : c)); }
      else { const { data } = await categoriesAPI.create(form); setCats(p => [...p, data.category]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete category?')) return;
    await categoriesAPI.delete(id);
    setCats(p => p.filter(c => c._id !== id));
    toast.success('Deleted');
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Categories</h2>
        <button onClick={() => { setForm({ name: '', description: '', icon: '', image: '' }); setEditId(null); setModal(true); }} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map(cat => (
          <div key={cat._id} className="card p-4 text-center relative group">
            <div className="text-3xl mb-2">{cat.icon}</div>
            <p className="font-semibold text-[var(--text)]">{cat.name}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{cat.description}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', image: cat.image || '' }); setEditId(cat._id); setModal(true); }}
                className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={12} /></button>
              <button onClick={() => del(cat._id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>{modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModal(false)}
        >
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-lg font-bold text-[var(--text)]">{editId ? 'Edit' : 'Add'} Category</h3>
              <button onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              {[['name', 'Name *'], ['icon', 'Emoji Icon'], ['description', 'Description'], ['image', 'Image URL']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{l}</label>
                  <input value={form[k]} onChange={set(k)} required={l.includes('*')} className="input-field text-sm" />
                </div>
              ))}
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save size={14} />{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

// ─── Founders ─────────────────────────────────────────────────────────────────
export function AdminFounders() {
  const [founders, setFounders] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', image: '', social: { linkedin: '', twitter: '', instagram: '' } });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { foundersAPI.getAll().then(r => setFounders(r.data.founders)); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await foundersAPI.update(editId, form); setFounders(p => p.map(f => f._id === editId ? data.founder : f)); }
      else { const { data } = await foundersAPI.create(form); setFounders(p => [...p, data.founder]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove founder?')) return;
    await foundersAPI.delete(id);
    setFounders(p => p.filter(f => f._id !== id));
    toast.success('Removed');
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setSocial = (k) => (e) => setForm(f => ({ ...f, social: { ...f.social, [k]: e.target.value } }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Founders</h2>
        <button onClick={() => { setForm({ name: '', role: 'Co-Founder', bio: '', image: '', social: { linkedin: '', twitter: '', instagram: '' } }); setEditId(null); setModal(true); }} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Founder
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {founders.map(f => (
          <div key={f._id} className="card p-5 flex gap-4">
            <img src={f.image} alt={f.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-bold text-[var(--text)]">{f.name}</p>
              <p className="text-primary-500 text-sm font-semibold">{f.role}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">{f.bio}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setForm({ name: f.name, role: f.role, bio: f.bio, image: f.image, social: f.social || {} }); setEditId(f._id); setModal(true); }}
                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-500 rounded-lg"><Edit2 size={14} /></button>
              <button onClick={() => del(f._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>{modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModal(false)}
        >
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-lg font-bold text-[var(--text)]">{editId ? 'Edit' : 'Add'} Founder</h3>
              <button onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              {[['name', 'Name *'], ['role', 'Role'], ['image', 'Photo URL']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{l}</label>
                  <input value={form[k]} onChange={set(k)} required={l.includes('*')} className="input-field text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Bio</label>
                <textarea value={form.bio} onChange={set('bio')} rows={3} className="input-field text-sm resize-none" />
              </div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Social Links</p>
              {['linkedin', 'twitter', 'instagram'].map(s => (
                <div key={s}>
                  <label className="block text-xs text-[var(--text-muted)] mb-1 capitalize">{s}</label>
                  <input value={form.social?.[s] || ''} onChange={setSocial(s)} className="input-field text-sm" placeholder={`https://${s}.com/...`} />
                </div>
              ))}
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save size={14} />{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

export default AdminOrders;
