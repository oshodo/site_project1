import { useState, useEffect } from 'react';
import { Eye, X, Truck, Check, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { ordersAPI, adminAPI, categoriesAPI, foundersAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  delivered:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  cancelled:  'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};
const STATUSES = ['pending','processing','shipped','delivered','cancelled'];

// ─── Orders ───────────────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ trackingNumber: '', carrier: '', estimatedDelivery: '' });
  const [savingTracking, setSavingTracking] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrders();
      setOrders(data.orders || []);
    } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    const statusMessages = {
      pending: 'Order received and pending confirmation',
      processing: 'Order is being processed and packed',
      shipped: 'Order has been shipped and is on the way',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
    };
    try {
      const { data } = await ordersAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status, timeline: data.order.timeline }));
      toast.success(`Status → ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const saveTracking = async () => {
    if (!selected) return;
    setSavingTracking(true);
    try {
      await ordersAPI.updateTracking(selected._id, trackingForm);
      setSelected(prev => ({ ...prev, ...trackingForm }));
      setOrders(prev => prev.map(o => o._id === selected._id ? { ...o, ...trackingForm } : o));
      toast.success('Tracking info saved!');
    } catch { toast.error('Failed to save tracking'); }
    finally { setSavingTracking(false); }
  };

  const openOrder = (order) => {
    setSelected(order);
    setTrackingForm({
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || '',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
    });
  };

  const filtered = orders.filter(o => {
    const matchFilter = !filter || o.status === filter;
    const matchSearch = !search || o._id?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">Orders</h1>
          <p className="text-xs text-[var(--text-muted)]">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, name, email..."
          className="input-field text-xs py-1.5 max-w-xs"/>
        <div className="flex gap-1.5 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] px-3 py-1.5 border capitalize font-bold tracking-wide transition-all ${filter === s ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-muted)]'}`}
              style={{ borderRadius: '2px' }}>
              {s || 'All'} ({s ? orders.filter(o => o.status === s).length : orders.length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden" style={{ borderRadius: '2px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-[var(--border)]">
              <tr>{['Order ID','Customer','Items','Total','Payment','Status','Date',''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16 text-[var(--text-muted)] text-xs">Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-[var(--text-muted)] text-xs">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[var(--text)] text-[11px]">#{order._id?.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{order.user?.name || '—'}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{order.items?.length} item(s)</td>
                  <td className="px-4 py-3 font-bold text-[var(--text)]">NPR {order.totalPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`} style={{ borderRadius: '2px' }}>
                      {order.isPaid ? '✓ Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 cursor-pointer border-0 capitalize ${STATUS_STYLES[order.status]}`}
                      style={{ borderRadius: '2px' }}>
                      {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openOrder(order)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-500 transition-colors" style={{ borderRadius: '2px' }}>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ borderRadius: '2px' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)] z-10">
              <div>
                <h3 className="font-bold text-[var(--text)]">Order #{selected._id?.slice(-8).toUpperCase()}</h3>
                <p className="text-[10px] text-[var(--text-muted)]">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" style={{ borderRadius: '2px' }}>
                <X size={16}/>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Update Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`px-3 py-1.5 text-[10px] font-bold capitalize border transition-all ${selected.status === s ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}
                      style={{ borderRadius: '2px' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-[var(--border)] p-4" style={{ borderRadius: '2px' }}>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Truck size={12} strokeWidth={2}/> Tracking Information
                </p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Tracking Number</label>
                    <input value={trackingForm.trackingNumber} onChange={e => setTrackingForm(f => ({ ...f, trackingNumber: e.target.value }))}
                      className="input-field text-xs py-1.5" placeholder="e.g. NP123456789"/>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Carrier</label>
                    <input value={trackingForm.carrier} onChange={e => setTrackingForm(f => ({ ...f, carrier: e.target.value }))}
                      className="input-field text-xs py-1.5" placeholder="e.g. DHL, FedEx"/>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Est. Delivery</label>
                    <input type="date" value={trackingForm.estimatedDelivery} onChange={e => setTrackingForm(f => ({ ...f, estimatedDelivery: e.target.value }))}
                      className="input-field text-xs py-1.5"/>
                  </div>
                </div>
                <button onClick={saveTracking} disabled={savingTracking} className="btn-primary text-[10px] py-1.5 px-4 flex items-center gap-1.5">
                  <Save size={11}/>{savingTracking ? 'Saving...' : 'Save Tracking'}
                </button>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border border-[var(--border)] p-3" style={{ borderRadius: '2px' }}>
                      <img src={item.image} alt="" className="w-10 h-10 object-contain bg-gray-50 dark:bg-gray-900"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text)] truncate">{item.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Qty: {item.quantity} × NPR {item.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-xs font-bold text-[var(--text)]">NPR {(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer + Total */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[var(--border)] p-4" style={{ borderRadius: '2px' }}>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Customer</p>
                  <p className="text-xs font-semibold text-[var(--text)]">{selected.user?.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{selected.user?.email}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2">{selected.shippingAddress?.address}, {selected.shippingAddress?.city}</p>
                </div>
                <div className="border border-[var(--border)] p-4" style={{ borderRadius: '2px' }}>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Payment</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[var(--text-muted)]"><span>Subtotal</span><span>NPR {selected.subtotal?.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[var(--text-muted)]"><span>Shipping</span><span>{selected.shippingPrice === 0 ? 'FREE' : `NPR ${selected.shippingPrice}`}</span></div>
                    <div className="flex justify-between font-bold text-[var(--text)] border-t border-[var(--border)] pt-1 mt-1"><span>Total</span><span>NPR {selected.totalPrice?.toLocaleString()}</span></div>
                  </div>
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

  useEffect(() => { adminAPI.getUsers().then(r => setUsers(r.data.users || [])).finally(() => setLoading(false)); }, []);

  const toggleRole = async (id, role) => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try { await adminAPI.updateUser(id, { role: newRole }); setUsers(p => p.map(u => u._id === id ? { ...u, role: newRole } : u)); toast.success('Role updated'); }
    catch { toast.error('Failed'); }
  };

  const del = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await adminAPI.deleteUser(id); setUsers(p => p.filter(u => u._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-[var(--text)]">Users</h1><p className="text-xs text-[var(--text-muted)]">{users.length} registered users</p></div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
        className="input-field text-xs py-2 max-w-xs"/>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden" style={{ borderRadius: '2px' }}>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-[var(--border)]">
            <tr>{['User','Email','Role','Joined','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? <tr><td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">Loading...</td></tr>
              : filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs flex-shrink-0 ${u.role === 'admin' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)]'}`} style={{ borderRadius: '2px' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-[var(--text)]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${u.role === 'admin' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)]'}`} style={{ borderRadius: '2px' }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] text-[10px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => toggleRole(u._id, u.role)} className="px-2 py-1 text-[10px] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] font-semibold transition-colors" style={{ borderRadius: '2px' }}>
                        {u.role === 'admin' ? '→ User' : '→ Admin'}
                      </button>
                      <button onClick={() => del(u._id, u.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 text-red-400 hover:text-red-600 transition-colors" style={{ borderRadius: '2px' }}>
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
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { categoriesAPI.getAll().then(r => setCats(r.data.categories || [])); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await categoriesAPI.update(editId, form); setCats(p => p.map(c => c._id === editId ? data.category : c)); }
      else { const { data } = await categoriesAPI.create(form); setCats(p => [...p, data.category]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-[var(--text)]">Categories</h1></div>
        <button onClick={() => { setForm({ name: '', description: '', icon: '', image: '' }); setEditId(null); setModal(true); }} className="btn-primary flex items-center gap-1.5 text-xs py-2">
          <Plus size={13}/> Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cats.map(cat => (
          <div key={cat._id} className="bg-[var(--bg-card)] border border-[var(--border)] p-5 text-center relative group" style={{ borderRadius: '2px' }}>
            <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
            <p className="font-bold text-xs text-[var(--text)] uppercase tracking-wide">{cat.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">{cat.description}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', image: cat.image || '' }); setEditId(cat._id); setModal(true); }}
                className="p-1 bg-blue-50 text-blue-500 hover:bg-blue-100" style={{ borderRadius: '2px' }}><Edit2 size={11}/></button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await categoriesAPI.delete(cat._id); setCats(p => p.filter(c => c._id !== cat._id)); toast.success('Deleted'); }}
                className="p-1 bg-red-50 text-red-500 hover:bg-red-100" style={{ borderRadius: '2px' }}><Trash2 size={11}/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 w-full max-w-md shadow-2xl" style={{ borderRadius: '2px' }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-[var(--text)]">{editId ? 'Edit' : 'Add'} Category</h3>
              <button onClick={() => setModal(false)}><X size={16}/></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              {[['name', 'Name *'], ['icon', 'Emoji Icon'], ['description', 'Description'], ['image', 'Image URL']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={l.includes('*')} className="input-field text-sm"/>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1 text-xs py-2">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                  <Save size={12}/>{saving ? 'Saving...' : 'Save'}
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
  const [form, setForm] = useState({ name: '', role: 'Co-Founder', bio: '', image: '', social: { linkedin: '', twitter: '', instagram: '' } });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { foundersAPI.getAll().then(r => setFounders(r.data.founders || [])); }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { const { data } = await foundersAPI.update(editId, form); setFounders(p => p.map(f => f._id === editId ? data.founder : f)); }
      else { const { data } = await foundersAPI.create(form); setFounders(p => [...p, data.founder]); }
      toast.success('Saved!'); setModal(false);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-[var(--text)]">Founders</h1></div>
        <button onClick={() => { setForm({ name: '', role: 'Co-Founder', bio: '', image: '', social: { linkedin: '', twitter: '', instagram: '' } }); setEditId(null); setModal(true); }}
          className="btn-primary flex items-center gap-1.5 text-xs py-2"><Plus size={13}/> Add Founder</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {founders.map(f => (
          <div key={f._id} className="bg-[var(--bg-card)] border border-[var(--border)] p-5 flex gap-4" style={{ borderRadius: '2px' }}>
            <img src={f.image} alt={f.name} className="w-16 h-16 object-cover flex-shrink-0 border border-[var(--border)]" style={{ borderRadius: '2px' }}/>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[var(--text)]">{f.name}</p>
              <p className="text-xs text-accent-400 font-semibold">{f.role}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{f.bio}</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button onClick={() => { setForm({ name: f.name, role: f.role, bio: f.bio, image: f.image, social: f.social || {} }); setEditId(f._id); setModal(true); }}
                className="p-1.5 hover:bg-blue-50 text-blue-500" style={{ borderRadius: '2px' }}><Edit2 size={12}/></button>
              <button onClick={async () => { if (!confirm('Remove?')) return; await foundersAPI.delete(f._id); setFounders(p => p.filter(x => x._id !== f._id)); toast.success('Removed'); }}
                className="p-1.5 hover:bg-red-50 text-red-400" style={{ borderRadius: '2px' }}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" style={{ borderRadius: '2px' }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-[var(--text)]">{editId ? 'Edit' : 'Add'} Founder</h3>
              <button onClick={() => setModal(false)}><X size={16}/></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              {[['name', 'Name *'], ['role', 'Role'], ['image', 'Photo URL']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={l.includes('*')} className="input-field text-sm"/>
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="input-field text-sm resize-none"/>
              </div>
              {['linkedin', 'twitter', 'instagram'].map(s => (
                <div key={s}>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{s}</label>
                  <input value={form.social?.[s] || ''} onChange={e => setForm(f => ({ ...f, social: { ...f.social, [s]: e.target.value } }))} className="input-field text-sm" placeholder={`https://${s}.com/...`}/>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1 text-xs py-2">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                  <Save size={12}/>{saving ? 'Saving...' : 'Save'}
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
