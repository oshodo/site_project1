// ============================================================
// client/src/pages/admin/AdminLayout.jsx
// Sidebar layout shared by all admin pages
// ============================================================
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/store';

const NAV_ITEMS = [
  { to: '/admin',             icon: '📊', label: 'Dashboard',  end: true },
  { to: '/admin/products',    icon: '🛍️', label: 'Products' },
  { to: '/admin/categories',  icon: '🗂️', label: 'Categories' },
  { to: '/admin/orders',      icon: '📦', label: 'Orders' },
  { to: '/admin/users',       icon: '👥', label: 'Users' },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col fixed top-0 left-0 z-30">
        {/* Brand */}
        <div className="p-6 border-b border-gray-700">
          <p className="text-xl font-bold text-orange-400">SabaiSale</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-400 hover:text-red-400 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            🚪 Logout
          </button>
          <NavLink
            to="/"
            className="block text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors mt-1"
          >
            🏠 View Store
          </NavLink>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
