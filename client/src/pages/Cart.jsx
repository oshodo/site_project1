import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, CheckCircle } from 'lucide-react';
import { useCartStore } from '../utils/store';
import { EmptyState } from '../components/common/index';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();
  const total = getTotal();
  const shipping = total > 5000 ? 0 : 200;
  const tax = Math.round(total * 0.13);

  if (items.length === 0) return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <EmptyState icon="🛒" title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
        />
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">
          Shopping Cart <span className="text-[var(--text-muted)] text-xl font-normal">({items.length} items)</span>
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.product._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                  className="card p-5 flex gap-4"
                >
                  <img src={item.product.image || item.product.images?.[0]} alt={item.product.name}
                    className="w-24 h-24 object-contain bg-gray-50 dark:bg-gray-900 rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product._id}`} className="font-semibold text-[var(--text)] hover:text-primary-500 line-clamp-2 text-sm">{item.product.name}</Link>
                    <p className="text-primary-500 font-bold mt-1">NPR {item.product.price?.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Minus size={14} /></button>
                        <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
                        ><Plus size={14} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--text)]">NPR {(item.product.price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeItem(item.product._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-[var(--text)] mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--text-muted)]"><span>Subtotal</span><span>NPR {total.toLocaleString()}</span></div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-500 font-semibold">FREE</span> : `NPR ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]"><span>Tax (13%)</span><span>NPR {tax.toLocaleString()}</span></div>
                {shipping > 0 && (
                  <p className="text-xs text-primary-500 bg-primary-50 dark:bg-primary-950 rounded-lg px-3 py-2">
                    Add NPR {(5000 - total).toLocaleString()} more for free shipping!
                  </p>
                )}
              </div>
              <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between font-bold text-[var(--text)] text-lg">
                <span>Total</span><span>NPR {(total + shipping + tax).toLocaleString()}</span>
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-4"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </motion.button>
              <Link to="/products" className="block text-center text-sm text-[var(--text-muted)] hover:text-primary-500 mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
