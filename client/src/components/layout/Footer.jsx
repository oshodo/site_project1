import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Shop<span className="text-orange-500">Zone</span></h3>
          <p className="text-sm leading-relaxed">Your one-stop destination for quality products at unbeatable prices.</p>
          <div className="flex gap-3 mt-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-orange-500 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Books', 'Sports'].map(cat => (
              <li key={cat}><Link to={`/products?category=${cat}`} className="hover:text-orange-500 transition-colors">{cat}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} ShopZone. All rights reserved.
      </div>
    </footer>
  )
}
