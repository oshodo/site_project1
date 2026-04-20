import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/products"      element={<ProductsPage />} />
          <Route path="/products/:id"  element={<ProductDetailPage />} />
          <Route path="/cart"          element={<CartPage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />

          {/* Private (logged-in users) */}
          <Route path="/checkout"       element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/order-success/:id" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
          <Route path="/orders"         element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
          <Route path="/orders/:id"     element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="/profile"        element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
