import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const STATUS_COLOR = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const statCards = data ? [
    { icon: <DollarSign size={20} />, label: 'Total Revenue', value: `NPR ${data.stats.totalRevenue?.toLocaleString()}`, color: 'bg-emerald-500', change: '+12%' },
    { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: data.stats.totalOrders, color: 'bg-blue-500', change: '+8%' },
    { icon: <Package size={20} />, label: 'Products', value: data.stats.totalProducts, color: 'bg-primary-500', change: '+3%' },
    { icon: <Users size={20} />, label: 'Customers', value: data.stats.totalUsers, color: 'bg-purple-500', change: '+15%' },
  ] : [];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Dashboard Overview</h2>
        <span className="text-sm text-[var(--text-muted)]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="card p-5"
          >
            <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white mb-3`}>
              {card.icon}
            </div>
            <p className="font-display text-2xl font-bold text-[var(--text)]">{card.value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{card.label}</p>
            <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-semibold">
              <TrendingUp size={12} />{card.change} this month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-[var(--text)]">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {data?.recentOrders?.map(order => (
              <div key={order._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--text)]">#{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge capitalize text-xs ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  <span className="font-semibold text-sm text-[var(--text)]">NPR {order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Top Products</h3>
          <div className="space-y-3">
            {data?.topProducts?.map((product, i) => (
              <div key={product._id} className="flex items-center gap-3">
                <span className="text-[var(--text-muted)] text-sm w-4 font-mono">{i + 1}</span>
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{product.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{product.numReviews} reviews</p>
                </div>
                <span className="font-bold text-sm text-[var(--text)]">NPR {product.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {data?.orderStats && (
        <div className="card p-5">
          <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Order Status Breakdown</h3>
          <div className="flex flex-wrap gap-3">
            {data.orderStats.map(s => (
              <div key={s._id} className={`px-4 py-3 rounded-xl ${STATUS_COLOR[s._id] || 'bg-gray-100 text-gray-600'}`}>
                <p className="text-xl font-bold">{s.count}</p>
                <p className="text-xs font-medium capitalize">{s._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
