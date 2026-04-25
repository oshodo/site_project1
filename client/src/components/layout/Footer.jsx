import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">
            Sabai<span className="text-orange-500">Sale</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Your premium destination for quality products at unbeatable prices — fast delivery, easy returns.
          </p>
          <div className="flex gap-3 mt-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-orange-500 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Books', 'Sports'].map(cat => (
              <li key={cat}>
                <Link to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-orange-500 transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            {['Help Center', 'Track Order', 'Return Policy', 'Privacy Policy', 'Terms of Service'].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-orange-500 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} SabaiSale. All rights reserved.
      </div>
    </footer>
  )
}
