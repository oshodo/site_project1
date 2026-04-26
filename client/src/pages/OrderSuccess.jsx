import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { ordersAPI } from '../utils/api';

export function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { ordersAPI.getById(id).then(r => setOrder(r.data.order)).catch(() => {}); }, [id]);
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-emerald-500" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Order Placed!</h1>
          <p className="text-[var(--text-muted)] mb-8">Thank you! We will notify you when it ships.</p>
          {order && (
            <div className="card p-5 text-left mb-8 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Order ID</span><span className="font-mono font-bold">#{order._id?.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Total</span><span className="font-bold">NPR {order.totalPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Status</span><span className="capitalize text-primary-500 font-semibold">{order.status}</span></div>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Link to="/orders" className="btn-primary flex items-center gap-2"><Package size={16} /> My Orders</Link>
            <Link to="/products" className="btn-ghost">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccess;
