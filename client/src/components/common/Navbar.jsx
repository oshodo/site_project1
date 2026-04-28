import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, Package, LogOut, Settings, LayoutDashboard, Sun, Moon, BarChart2 } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useThemeStore, useCompareStore } from '../../utils/store';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { user, logout, isLoggedIn, isAdmin } = useAuthStore();
  const { getCount } = useCartStore();
  const wishCount = useWishlistStore(s => s.items.length);
  const compareCount = useCompareStore(s => s.items.length);
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const cartCount = getCount();

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/products?search=${encodeURIComponent(searchQ.trim())}`); setSearchQ(''); }
  };

  const cats = ['Electronics', 'Fashion', 'Home', 'Accessories'];

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-500 text-white text-xs py-1 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <span>🇳🇵 Nepal's #1 Premium Store — Free shipping over NPR 5,000</span>
          <div className="flex items-center gap-4">
            <button onClick={toggle} className="flex items-center gap-1 hover:text-orange-200">
              {isDark ? <Sun size={12}/> : <Moon size={12}/>} {isDark ? 'Light' : 'Dark'} Mode
            </button>
            {!isLoggedIn() && <>
              <Link to="/login" className="hover:text-orange-200">Login</Link>
              <Link to="/register" className="hover:text-orange-200">Register</Link>
            </>}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-primary-500 sticky top-0 z-50 shadow-md">
        <div className="container-custom py-2.5">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="bg-white rounded px-2.5 py-1">
                <span className="font-bold text-primary-500 text-lg leading-none">Sabai</span>
                <span className="font-bold text-gray-800 text-lg leading-none">Sale</span>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
              <input
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search products, brands and more..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 rounded-l outline-none"
              />
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 px-4 rounded-r text-white flex items-center">
                <Search size={18}/>
              </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Compare */}
              <Link to="/compare" className="flex flex-col items-center text-white hover:text-orange-200 px-2 py-1 relative hidden md:flex">
                <BarChart2 size={20}/>
                <span className="text-xs mt-0.5">Compare</span>
                {compareCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">{compareCount}</span>}
              </Link>

              {/* Wishlist */}
              {isLoggedIn() && (
                <Link to="/wishlist" className="flex flex-col items-center text-white hover:text-orange-200 px-2 py-1 relative hidden md:flex">
                  <Heart size={20}/>
                  <span className="text-xs mt-0.5">Wishlist</span>
                  {wishCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>}
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center text-white hover:text-orange-200 px-2 py-1 relative">
                <div className="relative">
                  <ShoppingCart size={20}/>
                  {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount > 99 ? '99+' : cartCount}</span>}
                </div>
                <span className="text-xs mt-0.5">Cart</span>
              </Link>

              {/* User */}
              {isLoggedIn() ? (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setUserMenu(!userMenu)} className="flex flex-col items-center text-white hover:text-orange-200 px-2 py-1">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary-500 font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs mt-0.5 max-w-[60px] truncate">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: <Settings size={14}/>, label: 'My Account' },
                        { to: '/orders', icon: <Package size={14}/>, label: 'My Orders' },
                        { to: '/wishlist', icon: <Heart size={14}/>, label: 'Wishlist' },
                        ...(isAdmin() ? [{ to: '/admin', icon: <LayoutDashboard size={14}/>, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-500">
                          <span className="text-primary-500">{item.icon}</span>{item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                          <LogOut size={14}/>Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center text-white hover:text-orange-200 px-2 py-1">
                  <User size={20}/>
                  <span className="text-xs mt-0.5">Login</span>
                </Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
                {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
              </button>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-primary-600 hidden md:block">
          <div className="container-custom">
            <div className="flex items-center gap-6 py-1.5 overflow-x-auto category-scroll">
              <Link to="/products" className="text-white text-xs font-medium whitespace-nowrap hover:text-orange-200 flex items-center gap-1">
                <Menu size={14}/> All Categories
              </Link>
              {cats.map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} className="text-white/90 text-xs whitespace-nowrap hover:text-white">
                  {cat}
                </Link>
              ))}
              <Link to="/products?featured=true" className="text-yellow-300 text-xs whitespace-nowrap font-semibold hover:text-yellow-200">
                🔥 Flash Sale
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="p-3 space-y-1">
              {cats.map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {cat}
                </Link>
              ))}
              {!isLoggedIn() && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 btn-primary text-center">Login</Link>
                  <Link to="/register" className="flex-1 btn-secondary text-center">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
