// ============================================================
// client/src/components/common/ProtectedRoute.jsx
// ============================================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../utils/store';

// ─── Requires any logged-in user ─────────────────────────────
export const ProtectedRoute = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// ─── Requires admin role ──────────────────────────────────────
export const AdminRoute = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
};
