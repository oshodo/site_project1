import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_COLORS = { pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' };

function SimpleBar({ label, value, max, color = '#ee4d2d' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 text-gray-500 text-right truncate">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="w-20 text-gray-700 dark:text-gray-300 font-semibold text-right">
        {value > 999 ? `NPR ${(value/1000).toFixed(1)}K` : value}
      </span>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getDashboard().then(r => setData(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return (
    <div className="space-y-4">
      {Array(4).fill(null).map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />)}
    </div>
  );

  const monthlyData = data?.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue || 0), 1);
  const orderStats = data?.orderStats || [];
  const maxOrders = Math.max(...orderStats.map(d => d.count || 0), 1);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Analytics</h1>
        <p className="text-xs text-gray-500">Business performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <DollarSign size={16}/>, label: 'Revenue', value: `NPR ${(data?.stats?.totalRevenue || 0).toLocaleString()}`, sub: 'Total earned', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900' },
          { icon: <ShoppingBag size={16}/>, label: 'Orders', value: data?.stats?.totalOrders || 0, sub: 'Total orders', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900' },
          { icon: <Users size={16}/>, label: 'Customers', value: data?.stats?.totalUsers || 0, sub: 'Registered', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900' },
          { icon: <Package size={16}/>, label: 'Products', value: data?.stats?.totalProducts || 0, sub: 'Active listings', color: 'text-primary-600 bg-primary-50 dark:bg-primary-900' },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
            <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-2`}>{card.icon}</div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
            <p className="text-[10px] text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary-500"/> Monthly Revenue
          </h3>
          {monthlyData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-400">No revenue data yet</p>
              <p className="text-[10px] text-gray-300 mt-1">Start accepting orders to see analytics</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {monthlyData.map((d, i) => (
                <SimpleBar key={i}
                  label={MONTHS[(d._id?.month || 1) - 1]}
                  value={d.revenue || 0}
                  max={maxRevenue}
                  color="#ee4d2d"
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Order Status</h3>
          {orderStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orderStats.map(s => (
                <SimpleBar key={s._id}
                  label={s._id}
                  value={s.count}
                  max={maxOrders}
                  color={STATUS_COLORS[s._id] || '#6b7280'}
                />
              ))}
            </div>
          )}
          {/* Status legend */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1 text-[10px] text-gray-500 capitalize">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Top Products by Reviews</h3>
        {!data?.topProducts?.length ? (
          <p className="text-xs text-gray-400 text-center py-6">No product data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="text-left pb-2 text-[10px] font-semibold text-gray-500 uppercase">Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {data.topProducts.map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2 text-gray-400 font-mono">{i + 1}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100"/>
                        <span className="font-medium text-gray-800 dark:text-gray-200 max-w-[140px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-gray-500">{p.category?.name || '—'}</td>
                    <td className="py-2 font-semibold text-gray-800 dark:text-gray-200">NPR {p.price?.toLocaleString()}</td>
                    <td className="py-2">
                      <span className="text-yellow-500">{'★'.repeat(Math.round(p.rating || 0))}</span>
                      <span className="text-gray-300">{'★'.repeat(5 - Math.round(p.rating || 0))}</span>
                    </td>
                    <td className="py-2 text-gray-500">{p.numReviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Order Value', value: data?.stats?.totalOrders ? `NPR ${Math.round((data?.stats?.totalRevenue || 0) / data?.stats?.totalOrders).toLocaleString()}` : 'NPR 0' },
          { label: 'Conversion Rate', value: '3.2%' },
          { label: 'Return Rate', value: '1.8%' },
          { label: 'Customer Satisfaction', value: '4.8/5 ★' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-3 text-center">
            <p className="text-base font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
