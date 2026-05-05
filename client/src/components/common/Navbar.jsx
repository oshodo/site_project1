// client/src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore, useThemeStore, selectCartItemCount } from '../../utils/store';

const Navbar = () => {
  const { user, logout }  = useAuthStore();
  // FIX: use the exported selector — reactive and correct
  const itemCount          = useCartStore(selectCartItemCount);
  const { dark, toggle }   = useThemeStore();
  const navigate           = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-orange-500 shrink-0">
          🛍️ SabaiSale
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/"          className="hover:text-orange-500 dark:text-gray-200 transition-colors">Home</Link>
          <Link to="/products"  className="hover:text-orange-500 dark:text-gray-200 transition-colors">Products</Link>
          {user && (
            <Link to="/my-orders" className="hover:text-orange-500 dark:text-gray-200 transition-colors">My Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-orange-500 font-semibold">Admin ↗</Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-lg">
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="text-xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  : <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">{user.name[0].toUpperCase()}</div>
                }
                <span className="hidden sm:block text-sm font-medium dark:text-white truncate max-w-[100px]">{user.name}</span>
                <span className="text-xs text-gray-400">▾</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50"
                  onMouseLeave={() => setDropOpen(false)}>
                  <Link to="/profile"   className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white" onClick={() => setDropOpen(false)}>👤 Profile</Link>
                  <Link to="/my-orders" className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white" onClick={() => setDropOpen(false)}>📦 My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2.5 text-sm text-orange-500 font-semibold hover:bg-orange-50 dark:hover:bg-gray-700" onClick={() => setDropOpen(false)}>⚙️ Admin Panel</Link>
                  )}
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"    className="btn-outline text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 hidden sm:block">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen((v) => !v)}>
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t dark:border-gray-800 pt-3 bg-white dark:bg-gray-900">
          <Link to="/"          className="block py-2 text-sm dark:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products"  className="block py-2 text-sm dark:text-white" onClick={() => setMenuOpen(false)}>Products</Link>
          {user && <Link to="/my-orders" className="block py-2 text-sm dark:text-white" onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="block py-2 text-sm text-orange-500 font-semibold" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
          {!user && <Link to="/register" className="block py-2 text-sm text-orange-500 font-semibold" onClick={() => setMenuOpen(false)}>Sign Up</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
