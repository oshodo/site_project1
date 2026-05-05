// client/src/pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore, selectCartTotal } from '../utils/store';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const subtotal    = useCartStore(selectCartTotal);   // FIX: proper selector
  const { user }    = useAuthStore();
  const navigate    = useNavigate();

  const shipping    = subtotal >= 2000 ? 0 : 100;
  const tax         = Math.round(subtotal * 0.13);
  const grandTotal  = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) { toast.error('Please login to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold dark:text-white mb-8">🛒 Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 card">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-6">Your cart is empty</p>
            <Link to="/products" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="card p-4 flex items-center gap-4">
                  <img src={item.image || 'https://placehold.co/80x80'} alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`}
                      className="font-semibold dark:text-white hover:text-orange-500 line-clamp-2 block">{item.name}</Link>
                    <p className="text-orange-500 font-bold mt-1">NPR {item.price.toLocaleString()}</p>
                  </div>
                  {/* Qty control */}
                  <div className="flex items-center border dark:border-gray-600 rounded-xl overflow-hidden shrink-0">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)}
                      className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white font-bold text-lg">−</button>
                    <span className="w-10 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)}
                      className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white font-bold text-lg">+</button>
                  </div>
                  <p className="w-28 text-right font-bold dark:text-white shrink-0">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 text-2xl shrink-0 ml-1">×</button>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 hover:underline">Clear cart</button>
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit sticky top-24 space-y-4">
              <h2 className="font-bold text-lg dark:text-white">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between dark:text-gray-300">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `NPR ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && <p className="text-xs text-gray-400">Free shipping on orders above NPR 2,000</p>}
                <div className="flex justify-between dark:text-gray-300">
                  <span>Tax (13% VAT)</span>
                  <span>NPR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-3 border-t dark:border-gray-700 dark:text-white">
                  <span>Total</span>
                  <span className="text-orange-500">NPR {grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full py-3 text-base">
                Proceed to Checkout →
              </button>
              <Link to="/products" className="block text-center text-sm text-orange-500 hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
