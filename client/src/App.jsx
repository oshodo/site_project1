// client/src/App.jsx  —  Root Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useThemeStore } from './utils/store';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// ── Admin Pages (eagerly loaded) ─────────────────────────────
import AdminLayout      from './pages/admin/AdminLayout';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminUsers       from './pages/admin/AdminUsers';
import AdminCategories  from './pages/admin/AdminCategories';

// ── Public & User Pages (lazy loaded for performance) ────────
const Home          = lazy(() => import('./pages/Home'));
const Products      = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Profile       = lazy(() => import('./pages/Profile'));
const MyOrders      = lazy(() => import('./pages/MyOrders'));
const AuthCallback  = lazy(() => import('./pages/AuthCallback'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
  </div>
);

const App = () => {
  const { dark } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/"              element={<Home />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/cart"          element={<Cart />} />
          {/* Google OAuth callback — MUST be public */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ── Protected User ─────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"  element={<Checkout />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* ── Admin (JWT + role=admin) ────────────────────── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index             element={<AdminDashboard />} />
              <Route path="products"   element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="users"      element={<AdminUsers />} />
            </Route>
          </Route>

          {/* ── 404 ────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
