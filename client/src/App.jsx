import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useThemeStore, useAuthStore } from './utils/store';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Login';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminUsers } from './pages/admin/Orders';
import { AdminCategories } from './pages/admin/Orders';
import { AdminFounders } from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuthStore();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const Layout = ({ children }) => <><Navbar />{children}<Footer /></>;
const ProtectedLayout = ({ children }) => <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;

export default function App() {
  const { init } = useThemeStore();
  useEffect(() => { init(); }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          fontFamily: 'DM Sans, sans-serif',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
        success: { iconTheme: { primary: '#f17012', secondary: '#fff' } },
      }} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/compare" element={<Layout><Compare /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        {/* Protected */}
        <Route path="/cart" element={<ProtectedLayout><Cart /></ProtectedLayout>} />
        <Route path="/checkout" element={<ProtectedLayout><Checkout /></ProtectedLayout>} />
        <Route path="/order-success/:id" element={<ProtectedLayout><OrderSuccess /></ProtectedLayout>} />
        <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
        <Route path="/orders/:id" element={<ProtectedLayout><OrderDetail /></ProtectedLayout>} />
        <Route path="/wishlist" element={<ProtectedLayout><Wishlist /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="founders" element={<AdminFounders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
