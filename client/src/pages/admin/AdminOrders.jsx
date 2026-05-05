// ============================================================
// client/src/pages/admin/AdminOrders.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { orderAPI } from '../../utils/api';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Badge = ({ status }) => {
  const colors = {
    Pending:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Shipped:    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Delivered:  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Cancelled:  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// ─── Order Detail + Status Update Modal ──────────────────────
const OrderModal = ({ order, onClose, onUpdate }) => {
  const [status,   setStatus]   = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [note,     setNote]     = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const handleUpdate = async () => {
    setSaving(true);
    setError('');
    try {
      await orderAPI.updateStatus(order._id, { status, trackingNumber: tracking, note });
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          {/* Customer */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2 dark:text-white">Customer</h3>
            <p className="text-sm dark:text-gray-300">{order.user?.name}</p>
            <p className="text-sm text-gray-400">{order.user?.email}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2 dark:text-white">Shipping Address</h3>
            <p className="text-sm dark:text-gray-300">
              {order.shippingAddress?.fullName} · {order.shippingAddress?.phone}
            </p>
            <p className="text-sm text-gray-400">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://placehold.co/48x48'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold dark:text-white">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t dark:border-gray-700 pt-4 space-y-1 text-sm">
            <div className="flex justify-between dark:text-gray-300">
              <span>Subtotal</span><span>NPR {order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between dark:text-gray-300">
              <span>Shipping</span><span>NPR {order.shippingPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between dark:text-gray-300">
              <span>Tax (13% VAT)</span><span>NPR {order.taxPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base dark:text-white pt-1 border-t dark:border-gray-700">
              <span>Total</span><span>NPR {order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Status History</h3>
            <div className="space-y-2">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge status={h.status} />
                  <span className="text-gray-400">{new Date(h.changedAt).toLocaleString()}</span>
                  {h.note && <span className="text-gray-500 italic">— {h.note}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Update Status */}
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold dark:text-white">Update Status</h3>

              <select
                value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {(status === 'Shipped') && (
                <input
                  type="text" value={tracking} onChange={(e) => setTracking(e.target.value)}
                  placeholder="Tracking number (optional)"
                  className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
              )}

              <input
                type="text" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)"
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
              />

              <button
                onClick={handleUpdate} disabled={saving}
                className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Order Status'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAll({ page, limit: 15, status: statusFilter || undefined });
      setOrders(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border dark:border-gray-600 rounded-xl px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

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
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 font-mono text-xs dark:text-gray-300">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-white">{o.user?.name}</p>
                      <p className="text-xs text-gray-400">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold dark:text-white">
                      NPR {o.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(o)}
                        className="text-orange-500 hover:text-orange-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-400">No orders found.</div>
            )}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages} · {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
};

export default AdminOrders;
