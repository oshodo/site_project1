import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, UserCircle, Menu, X, ArrowLeft, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '../../utils/store';
import { Sun, Moon, Bell } from 'lucide-react';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
  { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/admin/categories', icon: <Tag size={18} />, label: 'Categories' },
  { to: '/admin/founders', icon: <UserCircle size={18} />, label: 'Founders' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();

  const NavLink = ({ item }) => {
    const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
    return (
      <Link to={item.to} onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >{item.icon}{item.label}</Link>
    );
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-950 text-white">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-lg">Sabai<span className="text-primary-400">Sale</span></span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-3 font-semibold">Navigation</p>
        {navItems.map(item => <NavLink key={item.to} item={item} />)}
      </div>
      <div className="p-4 border-t border-white/10 space-y-3">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="hidden lg:flex w-60 flex-shrink-0 flex-col"><Sidebar /></div>
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden flex flex-col"
          ><Sidebar /></motion.div>
        </>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Menu size={20} /></button>
            <h1 className="font-display font-bold text-lg text-[var(--text)]">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)]">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
}
