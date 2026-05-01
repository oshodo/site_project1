import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Heart, Search, Menu, X, ChevronDown,
  Package, LogOut, Settings, LayoutDashboard, Sun, Moon,
  BarChart2, User, Sparkles
} from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useThemeStore, useCompareStore } from '../../utils/store';

const NAV_LINKS = [
  { label: 'New Arrivals', to: '/products?sort=newest' },
  { label: 'Electronics', to: '/products?category=Electronics' },
  { label: 'Fashion', to: '/products?category=Fashion' },
  { label: 'Home', to: '/products?category=Home' },
  { label: 'Accessories', to: '/products?category=Accessories' },
  { label: 'Sale', to: '/products?featured=true', accent: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { user, logout, isLoggedIn, isAdmin } = useAuthStore();
  const { getCount } = useCartStore();
  const wishCount = useWishlistStore(s => s.items.length);
  const compareCount = useCompareStore(s => s.items.length);
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const cartCount = getCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/products?search=${encodeURIComponent(searchQ.trim())}`); setSearchQ(''); setSearchOpen(false); }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs py-2 text-center tracking-widest font-medium">
        FREE SHIPPING ON ORDERS OVER NPR 5,000 &nbsp;·&nbsp; AUTHENTIC PRODUCTS GUARANTEED
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-lg shadow-soft border-b border-[var(--border)]' : 'bg-white dark:bg-[#0a0a0a] border-b border-[var(--border)]'
      }`}>
        <div className="container-custom">
          <div className="flex items-center h-16 gap-6">

            {/* Mobile menu btn */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              {mobileOpen ? <X size={22} strokeWidth={1.5}/> : <Menu size={22} strokeWidth={1.5}/>}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#111111] dark:bg-white rounded-sm flex items-center justify-center">
                <Sparkles size={15} className="text-white dark:text-[#111111]" strokeWidth={2}/>
              </div>
              <div>
                <span className="font-bold text-[#111111] dark:text-white tracking-tight text-lg leading-none">Sabai</span>
                <span className="font-bold text-accent-400 tracking-tight text-lg leading-none">Sale</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-3.5 py-2 text-xs font-semibold tracking-wide transition-all rounded-sm ${
                    link.accent
                      ? 'text-accent-500 hover:text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20'
                      : location.pathname + location.search === link.to
                        ? 'text-[var(--text)] bg-gray-50 dark:bg-gray-900'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >{link.label}{link.accent && ' ✦'}</Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                <Search size={18} strokeWidth={1.5}/>
              </button>

              {/* Theme */}
              <button onClick={toggle}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                {isDark ? <Sun size={18} strokeWidth={1.5}/> : <Moon size={18} strokeWidth={1.5}/>}
              </button>

              {/* Compare */}
              <Link to="/compare" className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 hidden md:block">
                <BarChart2 size={18} strokeWidth={1.5}/>
                {compareCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[9px] font-bold rounded-full flex items-center justify-center">{compareCount}</span>}
              </Link>

              {/* Wishlist */}
              {isLoggedIn() && (
                <Link to="/wishlist" className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 hidden md:block">
                  <Heart size={18} strokeWidth={1.5}/>
                  {wishCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>}
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                <ShoppingBag size={18} strokeWidth={1.5}/>
                {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>

              {/* User */}
              {isLoggedIn() ? (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="w-7 h-7 bg-[#111111] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-[#111111] font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown size={13} strokeWidth={2} className={`text-[var(--text-muted)] transition-transform ${userMenu ? 'rotate-180' : ''}`}/>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#141414] border border-[var(--border)] rounded-sm shadow-medium py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-[var(--border)]">
                        <p className="text-xs font-bold text-[var(--text)]">{user?.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: <Settings size={13} strokeWidth={1.5}/>, label: 'Account Settings' },
                        { to: '/orders', icon: <Package size={13} strokeWidth={1.5}/>, label: 'My Orders' },
                        { to: '/wishlist', icon: <Heart size={13} strokeWidth={1.5}/>, label: 'Wishlist' },
                        ...(isAdmin() ? [{ to: '/admin', icon: <LayoutDashboard size={13} strokeWidth={1.5}/>, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                          {item.icon}{item.label}
                        </Link>
                      ))}
                      <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <LogOut size={13} strokeWidth={1.5}/>Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <Link to="/login" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] px-3 py-2 transition-colors">Login</Link>
                  <Link to="/register" className="btn-primary text-xs py-2 px-4">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white dark:bg-[#0a0a0a] border-t border-[var(--border)]">
            <div className="container-custom py-4 space-y-0.5">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-sm transition-colors ${link.accent ? 'text-accent-500' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn() && (
                <div className="flex gap-2 pt-3">
                  <Link to="/login" className="flex-1 btn-ghost text-center text-xs py-2.5">Login</Link>
                  <Link to="/register" className="flex-1 btn-primary text-center text-xs py-2.5">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setSearchOpen(false)}>
          <div className="bg-white dark:bg-[#141414] border-b border-[var(--border)] shadow-strong" onClick={e => e.stopPropagation()}>
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search size={18} strokeWidth={1.5} className="text-[var(--text-muted)] flex-shrink-0"/>
                <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search products, brands..."
                  className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text-muted)] text-base focus:outline-none py-2"/>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  <X size={18} strokeWidth={1.5}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
