// ============================================================
// client/src/pages/MyOrders.jsx
// User-facing order history with status timeline tracker
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const StatusTimeline = ({ current }) => {
  const isCancelled = current === 'Cancelled';
  const currentIdx  = STEPS.indexOf(current);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          ❌ Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-4">
      {STEPS.map((step, i) => {
        const done    = i <= currentIdx;
        const active  = i === currentIdx;
        const isLast  = i === STEPS.length - 1;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done
                  ? active
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                    : 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {done && !active ? '✓' : i + 1}
              </div>
              <p className={`text-xs mt-1 font-medium whitespace-nowrap ${
                done ? 'text-orange-500' : 'text-gray-400'
              }`}>
                {step}
              </p>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mb-5 mx-1 ${
                i < currentIdx ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MyOrders = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});
  const [expanded,   setExpanded]   = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getMyOrders({ page, limit: 10 });
        setOrders(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products"
            className="bg-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">

              {/* Order Header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3 cursor-pointer"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div>
                  <p className="text-xs text-gray-400 font-mono">
                    ORDER #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-bold dark:text-white">
                    NPR {order.totalPrice?.toLocaleString()}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    {
                      Pending:    'bg-yellow-100 text-yellow-800',
                      Processing: 'bg-blue-100 text-blue-800',
                      Shipped:    'bg-purple-100 text-purple-800',
                      Delivered:  'bg-green-100 text-green-800',
                      Cancelled:  'bg-red-100 text-red-800',
                    }[order.status]
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {expanded === order._id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === order._id && (
                <div className="border-t dark:border-gray-700 p-5 space-y-5">
                  {/* Tracking Timeline */}
                  <StatusTimeline current={order.status} />

                  {/* Tracking Number */}
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      📮 Tracking: <span className="font-mono font-medium dark:text-white">{order.trackingNumber}</span>
                    </p>
                  )}

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://placehold.co/56x56'}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover"
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

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm space-y-1">
                    <div className="flex justify-between dark:text-gray-300">
                      <span>Subtotal</span><span>NPR {order.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between dark:text-gray-300">
                      <span>Shipping</span>
                      <span>{order.shippingPrice === 0 ? 'Free' : `NPR ${order.shippingPrice}`}</span>
                    </div>
                    <div className="flex justify-between dark:text-gray-300">
                      <span>Tax (13%)</span><span>NPR {order.taxPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t dark:border-gray-700 dark:text-white">
                      <span>Total</span><span>NPR {order.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-medium dark:text-white mb-1">Shipping to:</p>
                    <p>{order.shippingAddress?.fullName} · {order.shippingAddress?.phone}</p>
                    <p>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.state}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-3 pt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                ← Previous
              </button>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-4 py-2 border rounded-xl text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
