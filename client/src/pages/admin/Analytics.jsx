import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function BarChart({ data, color = '#f17012' }) {
  if (!data?.length) return <div className="text-center text-[var(--text-muted)] py-8">No data yet</div>;
  const max = Math.max(...data.map(d => d.revenue || d.value || 0));
  return (
    <div className="flex items-end gap-2 h-48 pt-4">
      {data.map((d, i) => {
        const val = d.revenue || d.value || 0;
        const h = max > 0 ? (val / max) * 100 : 0;
        const label = d._id?.month ? MONTHS[(d._id.month - 1)] : d.label || `#${i+1}`;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
              <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="w-full rounded-t-lg cursor-pointer transition-opacity group-hover:opacity-80"
                style={{ backgroundColor: color, minHeight: val > 0 ? '4px' : '0' }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap transition-opacity z-10">
                {val > 999 ? `NPR ${(val/1000).toFixed(1)}K` : val}
              </div>
            </div>
            <span className="text-xs text-[var(--text-muted)] truncate w-full text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getDashboard().then(r => setData(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="space-y-4">{Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;

  const orderStatusData = data?.orderStats?.map(s => ({ label: s._id, value: s.count })) || [];
  const monthlyData = data?.monthlyRevenue || [];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-[var(--text)]">Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <DollarSign size={20} />, label: 'Total Revenue', value: `NPR ${data?.stats?.totalRevenue?.toLocaleString() || 0}`, color: 'bg-emerald-500' },
          { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: data?.stats?.totalOrders || 0, color: 'bg-blue-500' },
          { icon: <Users size={20} />, label: 'Customers', value: data?.stats?.totalUsers || 0, color: 'bg-purple-500' },
          { icon: <TrendingUp size={20} />, label: 'Products', value: data?.stats?.totalProducts || 0, color: 'bg-primary-500' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5">
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white mb-3`}>{card.icon}</div>
            <p className="font-display text-2xl font-bold text-[var(--text)]">{card.value}</p>
            <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Monthly Revenue (Last 6 months)</h3>
        <BarChart data={monthlyData} color="#f17012" />
      </div>

      {/* Order Status Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Orders by Status</h3>
          <BarChart data={orderStatusData} color="#6366f1" />
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Top Rated Products</h3>
          <div className="space-y-3">
            {data?.topProducts?.slice(0, 5).map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-[var(--text-muted)] text-sm font-mono w-5">{i + 1}</span>
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100 dark:bg-gray-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{p.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">⭐ {p.rating} ({p.numReviews} reviews)</p>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">NPR {p.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
