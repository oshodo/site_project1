import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const LINKS = {
  Shop: [['New Arrivals', '/products?sort=newest'], ['Electronics', '/products?category=Electronics'], ['Fashion', '/products?category=Fashion'], ['Home & Living', '/products?category=Home'], ['Accessories', '/products?category=Accessories']],
  Company: [['About Us', '/about'], ['Our Story', '/about'], ['Contact', '/about'], ['Careers', '/']],
  Support: [['Help Center', '/'], ['Track Order', '/orders'], ['Return Policy', '/'], ['Privacy Policy', '/']],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 border-t border-[#1a1a1a]">
      {/* Newsletter */}
      <div className="border-b border-[#1a1a1a]">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] text-accent-400 font-bold tracking-widest uppercase mb-2">Stay Connected</p>
              <h3 className="text-white font-bold text-lg tracking-tight">Get exclusive deals & updates</h3>
              <p className="text-gray-500 text-sm mt-1">Join 10,000+ subscribers. No spam, ever.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-[#141414] border border-[#2a2a2a] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                style={{ borderRadius: '2px' }}/>
              <button className="btn-accent px-5 py-2.5 text-xs flex items-center gap-2">
                Subscribe <ArrowRight size={13} strokeWidth={2}/>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-white flex items-center justify-center" style={{ borderRadius: '2px' }}>
                <span className="text-[#111111] font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Sabai<span className="text-accent-400">Sale</span></span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-5 max-w-xs">
              Nepal's premier destination for authentic premium products. Sourced globally, delivered locally.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><MapPin size={12} strokeWidth={1.5} className="text-accent-400 flex-shrink-0"/><span>Kathmandu, Nepal</span></div>
              <div className="flex items-center gap-2"><Phone size={12} strokeWidth={1.5} className="text-accent-400 flex-shrink-0"/><span>+977 98XXXXXXXX</span></div>
              <div className="flex items-center gap-2"><Mail size={12} strokeWidth={1.5} className="text-accent-400 flex-shrink-0"/><span>hello@sabaisale.com</span></div>
            </div>
            <div className="flex gap-2 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 border border-[#2a2a2a] hover:border-gray-500 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                  style={{ borderRadius: '2px' }}>
                  <Icon size={13} strokeWidth={1.5}/>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">{cat}</p>
              <ul className="space-y-2.5">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#1a1a1a]">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-gray-600">© {new Date().getFullYear()} SabaiSale. All rights reserved. Built with ♥ in Nepal.</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['eSewa', 'Khalti', 'COD', 'Bank Transfer'].map(p => (
              <span key={p} className="px-2 py-1 border border-[#2a2a2a] text-[9px] text-gray-600 font-semibold tracking-wider uppercase" style={{ borderRadius: '2px' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
