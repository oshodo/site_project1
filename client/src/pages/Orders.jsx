import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import { EmptyState } from '../components/common/index';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">My Orders</h1>
        {loading ? (
          <div className="space-y-4">{Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders yet" message="Start shopping to see your orders here."
            action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`}
                className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-[var(--text)]">#{order._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {order.items?.length} item(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge capitalize text-xs font-semibold px-3 py-1 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[var(--text)]">NPR {order.totalPrice?.toLocaleString()}</span>
                  <ArrowRight size={18} className="text-[var(--text-muted)]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
