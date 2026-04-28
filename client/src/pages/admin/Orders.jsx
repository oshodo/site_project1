import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { ordersAPI, adminAPI, categoriesAPI, foundersAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Trash2, Plus, Save } from 'lucide-react';

const STATUS_COLORS = { pending:'bg-amber-100 text-amber-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-emerald-100 text-emerald-700', cancelled:'bg-red-100 text-red-700' };
const STATUSES = ['pending','processing','shipped','delivered','cancelled'];

// ─── Orders ───────────────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { adminAPI.getOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Orders</h1>
          <p className="text-xs text-gray-500">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {['', ...STATUSES].map(s => {
          const count = s ? orders.filter(o => o.status === s).length : orders.length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] px-3 py-1.5 rounded-full border capitalize font-semibold transition-colors ${filter===s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-300'}`}>
              {s || 'All'} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>{['Order ID','Customer','Items','Total','Payment','Status','Date','Action'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading orders...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
                : filtered.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-bold text-gray-700 dark:text-gray-300">#{order._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{order.user?.name || '—'}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">{order.items?.length} item(s)</td>
                    <td className="px-3 py-2.5 font-bold text-gray-800 dark:text-gray-200">NPR {order.totalPrice?.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {order.isPaid ? '✓ Paid' : 'Unpaid'}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{order.paymentMethod}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded cursor-pointer border-0 ${STATUS_COLORS[order.status]}`}>
                        {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2.5 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => setSelected(order)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded transition-colors">
                        <Eye size={13}/>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3" onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Order #{selected._id?.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={16}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer</p>
                  <p className="text-gray-800 dark:text-gray-200">{selected.user?.name}</p>
                  <p className="text-gray-500">{selected.user?.email}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Shipping</p>
                  <p className="text-gray-800 dark:text-gray-200">{selected.shippingAddress?.fullName}</p>
                  <p className="text-gray-500">{selected.shippingAddress?.city}, {selected.shippingAddress?.country}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100"/>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} × NPR {item.price?.toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">NPR {(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 text-xs space-y-1">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>NPR {selected.subtotal?.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{selected.shippingPrice === 0 ? 'FREE' : `NPR ${selected.shippingPrice}`}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax</span><span>NPR {selected.taxPrice?.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span><span>NPR {selected.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { adminAPI.getUsers().then(r => setUsers(r.data.users)).finally(() => setLoading(false)); }, []);

  const toggleRole = async (id, role) => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try { await adminAPI.updateUser(id, { role: newRole }); setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u)); toast.success('Role updated'); }
    catch { toast.error('Failed'); }
  };

  const del = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await adminAPI.deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Users</h1><p className="text-xs text-gray-500">{users.length} registered users</p></div>
      </div>
      <div className="relative max-w-xs">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-3 py-2 text-xs"/>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>{['User','Email','Role','Joined','Actions'].map(h => <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
              : filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${u.role==='admin' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{u.email}</td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${u.role==='admin' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                  <td className="px-3 py-2.5 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => toggleRole(u._id, u.role)} className="px-2 py-1 text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded font-semibold hover:bg-blue-100 transition-colors">
                        {u.role==='admin' ? '→ User' : '→ Admin'}
                      </button>
                      <button onClick={() => del(u._id, u.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors">
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Categories ────────────────────────────────────────────────────────────────
export function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', icon:'', image:'' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { categoriesAPI.getAll().then(r => setCats(r.data.categories || [])); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await categoriesAPI.update(editId, form); setCats(p => p.map(c => c._id===editId ? data.category : c)); }
      else { const { data } = await categoriesAPI.create(form); setCats(p => [...p, data.category]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await categoriesAPI.delete(id); setCats(p => p.filter(c => c._id !== id)); toast.success('Deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Categories</h1></div>
        <button onClick={() => { setForm({ name:'', description:'', icon:'', image:'' }); setEditId(null); setModal(true); }} className="btn-primary flex items-center gap-1.5 text-xs py-2">
          <Plus size={14}/> Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cats.map(cat => (
          <div key={cat._id} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4 text-center relative group">
            <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
            <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">{cat.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{cat.description}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({ name:cat.name, description:cat.description||'', icon:cat.icon||'', image:cat.image||'' }); setEditId(cat._id); setModal(true); }}
                className="p-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100"><Edit2 size={11}/></button>
              <button onClick={() => del(cat._id)} className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"><Trash2 size={11}/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">{editId ? 'Edit' : 'Add'} Category</h3>
              <button onClick={() => setModal(false)}><X size={16}/></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              {[['name','Name *'],['icon','Emoji Icon (e.g. 📱)'],['description','Description'],['image','Image URL']].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={l.includes('*')} className="input-field text-sm"/>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1 text-xs py-2">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                  <Save size={13}/>{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Founders ─────────────────────────────────────────────────────────────────
export function AdminFounders() {
  const [founders, setFounders] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', role:'Co-Founder', bio:'', image:'', social:{ linkedin:'', twitter:'', instagram:'' } });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { foundersAPI.getAll().then(r => setFounders(r.data.founders || [])); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await foundersAPI.update(editId, form); setFounders(p => p.map(f => f._id===editId ? data.founder : f)); }
      else { const { data } = await foundersAPI.create(form); setFounders(p => [...p, data.founder]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove?')) return;
    await foundersAPI.delete(id); setFounders(p => p.filter(f => f._id !== id)); toast.success('Removed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Founders</h1></div>
        <button onClick={() => { setForm({ name:'', role:'Co-Founder', bio:'', image:'', social:{linkedin:'',twitter:'',instagram:''} }); setEditId(null); setModal(true); }} className="btn-primary flex items-center gap-1.5 text-xs py-2">
          <Plus size={14}/> Add Founder
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {founders.map(f => (
          <div key={f._id} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4 flex gap-3">
            <img src={f.image} alt={f.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-200"/>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{f.name}</p>
              <p className="text-xs text-primary-500 font-semibold">{f.role}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.bio}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setForm({ name:f.name, role:f.role, bio:f.bio, image:f.image, social:f.social||{} }); setEditId(f._id); setModal(true); }} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Edit2 size={12}/></button>
              <button onClick={() => del(f._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">{editId ? 'Edit' : 'Add'} Founder</h3>
              <button onClick={() => setModal(false)}><X size={16}/></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              {[['name','Name *'],['role','Role'],['image','Photo URL']].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={l.includes('*')} className="input-field text-sm"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="input-field text-sm resize-none"/>
              </div>
              {['linkedin','twitter','instagram'].map(s => (
                <div key={s}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{s} URL</label>
                  <input value={form.social?.[s]||''} onChange={e => setForm(f => ({ ...f, social: { ...f.social, [s]: e.target.value } }))} className="input-field text-sm" placeholder={`https://${s}.com/...`}/>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1 text-xs py-2">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                  <Save size={13}/>{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
