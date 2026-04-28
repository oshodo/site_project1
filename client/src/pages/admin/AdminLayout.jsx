import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, UserCircle, Menu, X, ArrowLeft, BarChart2, Home, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../utils/store';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={16}/>, label: 'Dashboard', end: true },
  { to: '/admin/analytics', icon: <BarChart2 size={16}/>, label: 'Analytics' },
  { to: '/admin/products', icon: <Package size={16}/>, label: 'Products' },
  { to: '/admin/orders', icon: <ShoppingBag size={16}/>, label: 'Orders' },
  { to: '/admin/users', icon: <Users size={16}/>, label: 'Users' },
  { to: '/admin/categories', icon: <Tag size={16}/>, label: 'Categories' },
  { to: '/admin/founders', icon: <UserCircle size={16}/>, label: 'Founders' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-white text-sm">SabaiSale Admin</span>
          </div>
          <span className="text-xs text-gray-400 mt-0.5 block">Management Panel</span>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={16}/></button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider px-3 py-2 font-semibold">Main Menu</p>
        {navItems.map(item => {
          const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                active ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}>
              {item.icon}{item.label}
              {item.label === 'Orders' && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">New</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <Home size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-700 rounded">
          <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-400 hover:text-red-400 text-xs">Exit</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col bg-gray-900">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-56 z-50 bg-gray-900 flex flex-col lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded">
              <Menu size={18}/>
            </button>
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search..." className="pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-primary-500 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell size={16} className="text-gray-600 dark:text-gray-300"/>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-600">
              <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
