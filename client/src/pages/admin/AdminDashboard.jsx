// ============================================================
// client/src/pages/admin/AdminDashboard.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

// ─── Stat Card ───────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, sub }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold mt-1 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────
const Badge = ({ status }) => {
  const colors = {
    Pending:    'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped:    'bg-purple-100 text-purple-800',
    Delivered:  'bg-green-100 text-green-800',
    Cancelled:  'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminAPI.getDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
  );

  const { stats, ordersByStatus, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>

      {/* ── Stats Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`NPR ${stats.totalRevenue.toLocaleString()}`}
          icon="💰" color="bg-green-100"
          sub={`NPR ${stats.monthlyRevenue.toLocaleString()} this month`}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon="📦" color="bg-blue-100"
          sub={`${stats.monthlyOrders} this month`}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon="👥" color="bg-purple-100"
        />
        <StatCard
          title="Active Products"
          value={stats.totalProducts.toLocaleString()}
          icon="🛍️" color="bg-orange-100"
        />
      </div>

      {/* ── Order Status Summary ─────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Orders by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <div key={s} className="text-center">
              <Badge status={s} />
              <p className="text-2xl font-bold mt-2 dark:text-white">{ordersByStatus[s] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Recent Orders ─────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-orange-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium dark:text-white">{order.user?.name}</p>
                  <p className="text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <Badge status={order.status} />
                  <p className="text-sm font-semibold mt-1 dark:text-white">
                    NPR {order.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Low Stock Alert ───────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">⚠️ Low Stock</h2>
            <Link to="/admin/products" className="text-sm text-orange-500 hover:underline">Manage</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">All products have sufficient stock.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || 'https://placehold.co/40x40'}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-red-500">{p.stock} left</p>
                  </div>
                  <p className="text-sm font-semibold dark:text-white">NPR {p.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
