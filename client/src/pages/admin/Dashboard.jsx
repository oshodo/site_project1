import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, ArrowUpRight, Eye, Clock } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

function StatCard({ icon, label, value, change, color, link }) {
  return (
    <Link to={link || '#'} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        {change && (
          <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={11}/>{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-3">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </Link>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array(4).fill(null).map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />)}
      </div>
    </div>
  );

  const stats = [
    { icon: <DollarSign size={18} className="text-emerald-600"/>, label: 'Total Revenue', value: `NPR ${data?.stats?.totalRevenue?.toLocaleString() || '0'}`, change: '+12%', color: 'bg-emerald-50 dark:bg-emerald-900', link: '/admin/analytics' },
    { icon: <ShoppingBag size={18} className="text-blue-600"/>, label: 'Total Orders', value: data?.stats?.totalOrders || 0, change: '+8%', color: 'bg-blue-50 dark:bg-blue-900', link: '/admin/orders' },
    { icon: <Package size={18} className="text-primary-600"/>, label: 'Products', value: data?.stats?.totalProducts || 0, change: '+3%', color: 'bg-orange-50 dark:bg-orange-900', link: '/admin/products' },
    { icon: <Users size={18} className="text-purple-600"/>, label: 'Customers', value: data?.stats?.totalUsers || 0, change: '+15%', color: 'bg-purple-50 dark:bg-purple-900', link: '/admin/users' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/admin/products" className="btn-primary text-xs py-2 flex items-center gap-1.5">
          <Package size={13}/> Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Clock size={14} className="text-primary-500"/> Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-primary-500 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={11}/>
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data?.recentOrders?.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-8">No orders yet</p>
            )}
            {data?.recentOrders?.map(order => (
              <div key={order._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 font-mono">#{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-[10px] text-gray-500">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">NPR {order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-primary-500 hover:underline">View All</Link>
          </div>
          <div className="p-3 space-y-3">
            {data?.topProducts?.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-4">No products yet</p>
            )}
            {data?.topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 font-mono w-4">{i+1}</span>
                <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">NPR {p.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                  <Eye size={10}/> {p.numReviews}
                </div>
              </div>
            ))}
            {(!data?.topProducts || data.topProducts.length === 0) && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400 mb-2">Add products to see stats</p>
                <Link to="/admin/products" className="btn-primary text-xs py-1.5 px-3">Add Products</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status */}
      {data?.orderStats?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Order Status Breakdown</h3>
          <div className="flex flex-wrap gap-2">
            {data.orderStats.map(s => (
              <div key={s._id} className={`px-3 py-2 rounded ${STATUS_COLORS[s._id] || 'bg-gray-100 text-gray-600'}`}>
                <p className="text-lg font-bold">{s.count}</p>
                <p className="text-[10px] font-medium capitalize">{s._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
