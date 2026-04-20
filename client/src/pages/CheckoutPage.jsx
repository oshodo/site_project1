import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const { cart, cartTotal, shippingFee, tax, orderTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]         = useState(0)
  const [placing, setPlacing]   = useState(false)

  const [shipping, setShipping] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', country: '', zip: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const validateShipping = () => {
    const { fullName, phone, street, city, state, country, zip } = shipping
    if (!fullName || !phone || !street || !city || !state || !country || !zip) {
      toast.error('Please fill all shipping fields'); return false
    }
    return true
  }

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice:    cartTotal,
        shippingPrice: shippingFee,
        taxPrice:      tax,
        totalPrice:    orderTotal,
      }
      const { data } = await api.post('/orders', orderData)

      // For COD, mark as confirmed; for card, simulate payment
      if (paymentMethod === 'card') {
        await api.put(`/orders/${data._id}/pay`, { id: 'sim_' + Date.now(), status: 'COMPLETED', updateTime: new Date().toISOString(), email: user.email })
      }

      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (cart.length === 0) { navigate('/cart'); return null }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? <FiCheck size={14} /> : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i === step ? 'text-orange-500' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiTruck className="text-orange-500" /> Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['fullName', 'Full Name', 'col-span-2'],
                  ['phone',    'Phone Number', 'col-span-2'],
                  ['street',   'Street Address', 'col-span-2'],
                  ['city',     'City', ''],
                  ['state',    'State / Province', ''],
                  ['country',  'Country', ''],
                  ['zip',      'ZIP / Postal Code', ''],
                ].map(([key, label, cls]) => (
                  <div key={key} className={cls || ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      className="input-field"
                      value={shipping[key]}
                      onChange={e => setShipping(s => ({ ...s, [key]: e.target.value }))}
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => validateShipping() && setStep(1)} className="btn-primary w-full mt-6">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiCreditCard className="text-orange-500" /> Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod',    label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                  { value: 'card',   label: 'Credit / Debit Card', icon: '💳', desc: 'Secure payment (simulated in demo)' },
                  { value: 'wallet', label: 'Digital Wallet', icon: '📱', desc: 'Apple Pay, Google Pay, etc.' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)} className="accent-orange-500" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Simulated card form */}
              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <p className="text-xs text-orange-600 font-medium">⚠ Demo mode — no real charge</p>
                  <input className="input-field" placeholder="Card Number: 4242 4242 4242 4242" disabled value="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="MM/YY" disabled value="12/28" />
                    <input className="input-field" placeholder="CVV" disabled value="123" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Review Order</h2>

              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Shipping to:</p>
                <p className="text-sm text-gray-600">{shipping.fullName} • {shipping.phone}</p>
                <p className="text-sm text-gray-600">{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
              </div>

              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={placeOrder} disabled={placing} className="btn-primary flex-1">
                  {placing ? 'Placing Order...' : `Place Order — $${orderTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span><span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
