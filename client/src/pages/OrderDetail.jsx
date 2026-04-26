import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronLeft, MapPin, CreditCard } from 'lucide-react';
import { ordersAPI } from '../utils/api';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_ICONS = {
  pending: <Clock size={20} />,
  processing: <Package size={20} />,
  shipped: <Truck size={20} />,
  delivered: <CheckCircle size={20} />,
  cancelled: <XCircle size={20} />,
};
const STATUS_COLORS = {
  pending: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  processing: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  shipped: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
  delivered: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
  cancelled: 'text-red-500 bg-red-50 dark:bg-red-950',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getById(id).then(r => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl space-y-4">
        {Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  if (!order) return (
    <div className="pt-24 pb-16 text-center">
      <p className="text-[var(--text-muted)]">Order not found.</p>
      <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  );

  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/orders" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-[var(--text-muted)]" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text)]">
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`ml-auto badge text-sm px-4 py-2 capitalize font-semibold ${STATUS_COLORS[order.status]}`}>
            {STATUS_ICONS[order.status]}
            <span className="ml-1.5">{order.status}</span>
          </span>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
            <h3 className="font-semibold text-[var(--text)] mb-6">Order Progress</h3>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      i <= stepIdx ? 'bg-primary-500 text-white shadow-glow' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)]'
                    }`}>
                      {i < stepIdx ? <CheckCircle size={18} /> : STATUS_ICONS[step]}
                    </div>
                    <p className={`text-xs mt-2 capitalize font-medium ${i <= stepIdx ? 'text-primary-500' : 'text-[var(--text-muted)]'}`}>{step}</p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < stepIdx ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--text)] mb-4">Items Ordered ({order.items?.length})</h3>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name}
                      className="w-16 h-16 rounded-xl object-contain bg-gray-50 dark:bg-gray-900 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text)] truncate">{item.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[var(--text)]">NPR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-primary-500" /> Shipping Address
              </h3>
              <div className="text-sm text-[var(--text-muted)] space-y-1">
                <p className="font-semibold text-[var(--text)]">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-primary-500" /> Payment
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)] capitalize">{order.paymentMethod}</span>
                <span className={`badge font-semibold ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {order.isPaid ? '✓ Paid' : 'Pending Payment'}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-5 h-fit sticky top-24">
            <h3 className="font-semibold text-[var(--text)] mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal</span><span>NPR {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? <span className="text-emerald-500">FREE</span> : `NPR ${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Tax</span><span>NPR {order.taxPrice?.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount</span><span>- NPR {order.discount?.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between font-bold text-[var(--text)] text-lg">
              <span>Total</span><span>NPR {order.totalPrice?.toLocaleString()}</span>
            </div>
            <Link to="/products" className="btn-primary w-full mt-5 text-center block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
