import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Electronics', to: '/products?category=electronics' },
    { label: 'Fashion', to: '/products?category=fashion' },
    { label: 'Home & Living', to: '/products?category=home' },
    { label: 'Accessories', to: '/products?category=accessories' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Story', to: '/about' },
    { label: 'Contact', to: '/about' },
    { label: 'Careers', to: '/' },
  ],
  Support: [
    { label: 'Help Center', to: '/' },
    { label: 'Track Order', to: '/orders' },
    { label: 'Return Policy', to: '/' },
    { label: 'Privacy Policy', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-24">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">Stay in the loop</h3>
              <p className="text-gray-400 mt-1">Get exclusive deals and new arrivals in your inbox.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email" placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
              />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2"
              >
                Subscribe <ArrowRight size={16} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">S</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Sabai<span className="text-primary-400">Sale</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Nepal's premium e-commerce platform. Connecting you with the best products from around the world.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-primary-400" /><span>Kathmandu, Nepal</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-primary-400" /><span>+977 98XXXXXXXX</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-primary-400" /><span>hello@sabaisale.com</span></div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                ><Icon size={16} /></motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-body font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SabaiSale. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with ❤️ in Nepal</span>
            <div className="flex gap-2">
              {['VISA', 'MC', 'eSewa', 'Khalti'].map(pay => (
                <span key={pay} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
