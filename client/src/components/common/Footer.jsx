// client/src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <p className="text-xl font-bold text-orange-400 mb-3">🛍️ SabaiSale</p>
        <p className="text-sm leading-relaxed">Nepal's trusted eCommerce platform. Quality products, fast delivery.</p>
      </div>
      <div>
        <p className="text-white font-semibold mb-3">Shop</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-orange-400 transition-colors">All Products</Link></li>
          <li><Link to="/products?featured=true" className="hover:text-orange-400 transition-colors">Featured</Link></li>
          <li><Link to="/cart" className="hover:text-orange-400 transition-colors">Cart</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-white font-semibold mb-3">Account</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/login"     className="hover:text-orange-400 transition-colors">Login</Link></li>
          <li><Link to="/register"  className="hover:text-orange-400 transition-colors">Register</Link></li>
          <li><Link to="/my-orders" className="hover:text-orange-400 transition-colors">My Orders</Link></li>
          <li><Link to="/profile"   className="hover:text-orange-400 transition-colors">Profile</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-white font-semibold mb-3">Contact</p>
        <ul className="space-y-2 text-sm">
          <li>📧 support@sabaisale.com</li>
          <li>📞 +977-98XXXXXXXX</li>
          <li>📍 Kathmandu, Nepal</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 text-center py-5 text-xs">
      © {new Date().getFullYear()} SabaiSale. All rights reserved.
    </div>
  </footer>
);

export default Footer;
