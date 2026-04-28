import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-6">
      <div className="container-custom py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="bg-primary-500 rounded px-2 py-1 inline-block mb-3">
              <span className="font-bold text-white text-lg">Sabai</span>
              <span className="font-bold text-white text-lg">Sale</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">Nepal's premium e-commerce platform. Quality products, fast delivery.</p>
            <div className="flex gap-2 mt-3">
              {['📘', '🐦', '📸'].map((icon, i) => (
                <a key={i} href="#" className="w-7 h-7 bg-gray-700 hover:bg-primary-500 rounded flex items-center justify-center text-xs transition-colors">{icon}</a>
              ))}
            </div>
          </div>
          {[
            { title: 'Shop', links: [['All Products', '/products'], ['Electronics', '/products?category=Electronics'], ['Fashion', '/products?category=Fashion'], ['Home', '/products?category=Home']] },
            { title: 'Account', links: [['My Account', '/profile'], ['Orders', '/orders'], ['Wishlist', '/wishlist'], ['Login', '/login']] },
            { title: 'Support', links: [['About Us', '/about'], ['Contact', '/about'], ['Return Policy', '/'], ['Privacy Policy', '/']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-xs text-gray-400 hover:text-primary-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} SabaiSale. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['eSewa', 'Khalti', 'COD', 'Bank Transfer'].map(p => (
              <span key={p} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
