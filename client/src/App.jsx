// ============================================================
// client/src/App.jsx — Root Router with protected & admin routes
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect }        from 'react';
import { useThemeStore }    from './utils/store';

// Layout & Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Admin Pages
import AdminLayout      from './pages/admin/AdminLayout';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminUsers       from './pages/admin/AdminUsers';
import AdminCategories  from './pages/admin/AdminCategories';

// User Pages (import these from existing files in your repo)
import MyOrders  from './pages/MyOrders';

// Lazy-load heavy pages that already exist in the repo
import { lazy, Suspense } from 'react';
const Home          = lazy(() => import('./pages/Home'));
const Products      = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Profile       = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
  </div>
);

const App = () => {
  const { dark } = useThemeStore();

  // Apply dark class to root <html> for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ──────────────────────────────── */}
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/cart"         element={<Cart />} />

          {/* ── Protected User Routes ──────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"  element={<Checkout />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* ── Admin Routes (JWT + role=admin required) ────── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index              element={<AdminDashboard />} />
              <Route path="products"    element={<AdminProducts />} />
              <Route path="categories"  element={<AdminCategories />} />
              <Route path="orders"      element={<AdminOrders />} />
              <Route path="users"       element={<AdminUsers />} />
            </Route>
          </Route>

          {/* ── 404 Fallback ───────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
