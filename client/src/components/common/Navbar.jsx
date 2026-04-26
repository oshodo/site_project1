import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Sun, Moon, Menu, X, Search, ChevronDown, Package, LogOut, Settings, LayoutDashboard, BarChart2 } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useThemeStore, useCompareStore } from '../../utils/store';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout, isLoggedIn, isAdmin } = useAuthStore();
  const { getCount } = useCartStore();
  const wishlistCount = useWishlistStore(s => s.items.length);
  const compareCount = useCompareStore(s => s.items.length);
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setUserMenu(false); }, [location]);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false); setSearchQuery('');
    }
  };

  const cartCount = getCount();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--bg)]/95 backdrop-blur-lg shadow-sm border-b border-[var(--border)]' : 'bg-transparent'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-display font-bold text-lg">S</span>
                </div>
                <span className="font-display font-bold text-xl text-[var(--text)]">Sabai<span className="text-primary-500">Sale</span></span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 ${location.pathname === link.to ? 'text-primary-500 bg-primary-50 dark:bg-primary-950' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >{link.label}</Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1.5">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                <Search size={20} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggle}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Compare */}
              <Link to="/compare">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                  <BarChart2 size={20} />
                  {compareCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{compareCount}</span>}
                </motion.div>
              </Link>

              {/* Wishlist */}
              {isLoggedIn() && (
                <Link to="/wishlist">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] hover:text-rose-500 transition-colors">
                    <Heart size={20} />
                    {wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
                  </motion.div>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* User Menu */}
              {isLoggedIn() ? (
                <div className="relative" ref={menuRef}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-[var(--text)] max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {userMenu && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-full mt-2 w-52 card overflow-hidden z-50 py-1">
                        <p className="px-4 py-2 text-xs text-[var(--text-muted)] border-b border-[var(--border)]">{user?.email}</p>
                        {[
                          { to: '/profile', icon: <Settings size={15} />, label: 'Profile Settings' },
                          { to: '/orders', icon: <Package size={15} />, label: 'My Orders' },
                          ...(isAdmin() ? [{ to: '/admin', icon: <LayoutDashboard size={15} />, label: 'Admin Panel' }] : []),
                        ].map(item => (
                          <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <span className="text-primary-500">{item.icon}</span>{item.label}
                          </Link>
                        ))}
                        <div className="border-t border-[var(--border)] mt-1 pt-1">
                          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
                            <LogOut size={15} />Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
                </div>
              )}

              <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]/98 backdrop-blur-lg">
              <div className="container-custom py-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block px-4 py-3 rounded-xl text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">{link.label}</Link>
                ))}
                <Link to="/compare" className="block px-4 py-3 rounded-xl text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Compare ({compareCount})</Link>
                {!isLoggedIn() && (
                  <div className="pt-3 flex gap-2">
                    <Link to="/login" className="flex-1 btn-ghost text-center">Login</Link>
                    <Link to="/register" className="flex-1 btn-primary text-center">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl card p-2" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={20} className="ml-3 text-[var(--text-muted)] flex-shrink-0" />
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="flex-1 bg-transparent py-3 text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none text-lg font-body" />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X size={18} className="text-[var(--text-muted)]" /></button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
