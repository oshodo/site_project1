import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, Eye, Tag, X } from 'lucide-react';
import { useCartStore, useAuthStore } from '../utils/store';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];
const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
  { value: 'esewa', label: 'eSewa', icon: '🟢', desc: 'Fast digital wallet payment' },
  { value: 'khalti', label: 'Khalti', icon: '💜', desc: 'Khalti digital wallet' },
  { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard accepted' },
];

const COUPONS = {
  'SABAI10': 10,
  'JEEVAN20': 20,
  'NEPAL15': 15,
  'WELCOME50': 50,
};

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [shipping, setShipping] = useState({
    fullName: user?.name || '', phone: '', address: '', city: 'Kathmandu', postalCode: '', country: 'Nepal',
  });

  const subtotal = getTotal();
  const shippingFee = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.13);
  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.pct / 100)) : 0;
  const grandTotal = subtotal + shippingFee + tax - discount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!COUPONS[code]) { setCouponError('Invalid coupon code'); return; }
    setAppliedCoupon({ code, pct: COUPONS[code] });
    setCouponError('');
    toast.success(`Coupon applied! ${COUPONS[code]}% off 🎉`);
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCoupon(''); };

  const validateShipping = () => {
    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city) {
      toast.error('Please fill all shipping fields'); return false;
    }
    return true;
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = items.map(i => ({
        product: i.product._id, name: i.product.name,
        image: i.product.image || i.product.images?.[0] || '',
        price: i.product.price, quantity: i.quantity,
      }));
      const { data } = await ordersAPI.create({
        items: orderItems, shippingAddress: shipping, paymentMethod,
        couponCode: appliedCoupon?.code,
      });

      // eSewa simulation
      if (paymentMethod === 'esewa') {
        toast.success('Redirecting to eSewa...', { icon: '🟢' });
        await new Promise(r => setTimeout(r, 1500));
        toast.success('eSewa payment successful! (Demo)');
      } else if (paymentMethod === 'khalti') {
        toast.success('Redirecting to Khalti...', { icon: '💜' });
        await new Promise(r => setTimeout(r, 1500));
        toast.success('Khalti payment successful! (Demo)');
      }

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  const StepIcon = ({ s, current }) => (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
      s < current ? 'bg-emerald-500 text-white' : s === current ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-[var(--text-muted)]'
    }`}>
      {s < current ? <Check size={16} /> : s + 1}
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <StepIcon s={i} current={step} />
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-primary-500' : 'text-[var(--text-muted)]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 transition-colors ${i < step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 0 — Shipping */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-display text-xl font-bold text-[var(--text)] flex items-center gap-2 mb-5">
                  <Truck size={20} className="text-primary-500" /> Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'Full Name', col: 'col-span-2' },
                    { key: 'phone', label: 'Phone Number', col: 'col-span-2' },
                    { key: 'address', label: 'Street Address', col: 'col-span-2' },
                    { key: 'city', label: 'City' },
                    { key: 'postalCode', label: 'Postal Code' },
                    { key: 'country', label: 'Country', col: 'col-span-2' },
                  ].map(f => (
                    <div key={f.key} className={f.col || ''}>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">{f.label}</label>
                      <input value={shipping[f.key]} onChange={e => setShipping(s => ({ ...s, [f.key]: e.target.value }))}
                        className="input-field" placeholder={f.label} />
                    </div>
                  ))}
                </div>
                <button onClick={() => validateShipping() && setStep(1)} className="btn-primary w-full mt-5 py-3.5">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-display text-xl font-bold text-[var(--text)] flex items-center gap-2 mb-5">
                  <CreditCard size={20} className="text-primary-500" /> Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === pm.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : 'border-[var(--border)] hover:border-primary-300'
                    }`}>
                      <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value}
                        onChange={() => setPaymentMethod(pm.value)} className="sr-only" />
                      <span className="text-2xl">{pm.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[var(--text)]">{pm.label}</p>
                        <p className="text-xs text-[var(--text-muted)]">{pm.desc}</p>
                      </div>
                      {paymentMethod === pm.value && <Check size={18} className="text-primary-500" />}
                    </label>
                  ))}
                </div>

                {/* Payment Badges */}
                {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 mb-4">
                    <p className="text-sm text-amber-700 dark:text-amber-400">⚠️ Demo mode — no real payment will be charged. Real integration requires merchant account.</p>
                  </div>
                )}

                {/* Coupon */}
                <div className="border-t border-[var(--border)] pt-5 mt-2">
                  <h3 className="font-semibold text-sm text-[var(--text)] flex items-center gap-2 mb-3"><Tag size={14} className="text-primary-500" /> Apply Coupon</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                      <div>
                        <span className="font-mono font-bold text-emerald-600">{appliedCoupon.code}</span>
                        <span className="text-sm text-emerald-600 ml-2">— {appliedCoupon.pct}% off applied!</span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-500 hover:text-emerald-700"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code (try SABAI10)"
                        className="input-field flex-1 text-sm" onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                      <button onClick={applyCoupon} className="btn-ghost text-sm px-4 py-2.5">Apply</button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  <p className="text-xs text-[var(--text-muted)] mt-2">Try: SABAI10, JEEVAN20, NEPAL15, WELCOME50</p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(0)} className="btn-ghost flex-1">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3.5">Review Order</button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-display text-xl font-bold text-[var(--text)] flex items-center gap-2 mb-5">
                  <Eye size={20} className="text-primary-500" /> Review Order
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-5 text-sm">
                  <p className="font-semibold text-[var(--text)] mb-1">Shipping to:</p>
                  <p className="text-[var(--text-muted)]">{shipping.fullName} • {shipping.phone}</p>
                  <p className="text-[var(--text-muted)]">{shipping.address}, {shipping.city}, {shipping.country}</p>
                  <p className="font-semibold text-[var(--text)] mt-3 mb-1">Payment:</p>
                  <p className="text-[var(--text-muted)] capitalize">{PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}</p>
                </div>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product._id} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-contain bg-gray-100 dark:bg-gray-800 rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">{item.product.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity} × NPR {item.product.price?.toLocaleString()}</p>
                      </div>
                      <span className="font-bold text-sm text-[var(--text)]">NPR {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                  <button onClick={placeOrder} disabled={placing} className="btn-primary flex-1 py-3.5">
                    {placing ? 'Placing Order...' : `Place Order — NPR ${grandTotal.toLocaleString()}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-5 h-fit sticky top-24">
            <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4">Summary</h3>
            <div className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <div className="flex justify-between"><span>Subtotal ({items.length} items)</span><span>NPR {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? <span className="text-emerald-500 font-semibold">FREE</span> : `NPR ${shippingFee}`}</span></div>
              <div className="flex justify-between"><span>Tax (13%)</span><span>NPR {tax.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-500 font-semibold"><span>Coupon ({appliedCoupon.code})</span><span>- NPR {discount.toLocaleString()}</span></div>}
            </div>
            <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between font-bold text-[var(--text)] text-lg">
              <span>Total</span><span>NPR {grandTotal.toLocaleString()}</span>
            </div>
            {/* Items preview */}
            <div className="mt-4 space-y-2">
              {items.slice(0, 3).map(item => (
                <div key={item.product._id} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 dark:bg-gray-800" />
                  <span className="truncate flex-1">{item.product.name}</span>
                  <span>×{item.quantity}</span>
                </div>
              ))}
              {items.length > 3 && <p className="text-xs text-[var(--text-muted)] text-center">+{items.length - 3} more items</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
