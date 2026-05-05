// client/src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore, selectCartTotal } from '../utils/store';
import { orderAPI } from '../utils/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'COD',    label: '💵 Cash on Delivery' },
  { value: 'eSewa',  label: '💚 eSewa' },
  { value: 'Khalti', label: '💜 Khalti' },
];

const Checkout = () => {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const { items, clearCart } = useCartStore();
  const subtotal  = useCartStore(selectCartTotal);    // FIX: proper selector

  const shipping    = subtotal >= 2000 ? 0 : 100;
  const tax         = Math.round(subtotal * 0.13);
  const grandTotal  = subtotal + shipping + tax;

  const [form, setForm] = useState({
    fullName: user?.name   || '',
    phone:    user?.phone  || '',
    street:   user?.address?.street || '',
    city:     user?.address?.city   || '',
    state:    user?.address?.state  || '',
    zip:      user?.address?.zip    || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes,   setNotes]   = useState('');
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setPlacing(true);
    try {
      await orderAPI.create({
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod,
        notes,
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🛒</p>
          <p className="dark:text-white mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">Go Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold dark:text-white mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-5 dark:text-white">📍 Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">Full Name *</label>
                      <input name="fullName" value={form.fullName} onChange={handleChange} required className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">Street Address *</label>
                    <input name="street" value={form.street} onChange={handleChange} required className="input" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">City *</label>
                      <input name="city" value={form.city} onChange={handleChange} required className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">State *</label>
                      <input name="state" value={form.state} onChange={handleChange} required className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">ZIP</label>
                      <input name="zip" value={form.zip} onChange={handleChange} className="input" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-5 dark:text-white">💳 Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.value} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === m.value ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)} className="accent-orange-500" />
                      <span className="font-medium dark:text-white">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-4 dark:text-white">📝 Order Notes (optional)</h2>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="input resize-none" placeholder="Any special instructions…" />
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit sticky top-24 space-y-4">
              <h2 className="font-bold text-lg dark:text-white">Order Summary</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.image || 'https://placehold.co/40x40'} alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold dark:text-white shrink-0">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between dark:text-gray-300"><span>Subtotal</span><span>NPR {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>{shipping === 0 ? 'FREE' : `NPR ${shipping}`}</span>
                </div>
                <div className="flex justify-between dark:text-gray-300"><span>Tax (13%)</span><span>NPR {tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t dark:border-gray-700 dark:text-white">
                  <span>Total</span><span className="text-orange-500">NPR {grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button type="submit" disabled={placing} className="btn-primary w-full py-3 text-base">
                {placing ? 'Placing Order…' : '🎉 Place Order'}
              </button>
              <p className="text-xs text-center text-gray-400">By placing the order you agree to our Terms</p>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
