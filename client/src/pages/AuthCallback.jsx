// ============================================================
// client/src/pages/AuthCallback.jsx
// Google redirects to /auth/callback?token=xxx&role=admin
// This page reads the token, saves it, and redirects properly.
// ============================================================
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/store';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate    = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const token  = params.get('token');
      const role   = params.get('role');
      const error  = params.get('error');

      if (error || !token) {
        toast.error('Google Sign-In failed. Please try again.');
        navigate('/login');
        return;
      }

      try {
        // Store token first so the API interceptor can use it
        localStorage.setItem('token', token);

        // Fetch full user profile with the new token
        const res  = await authAPI.getMe();
        const user = res.data.data;

        setAuth(user, token);
        toast.success(`Welcome, ${user.name}! 👋`);

        // Redirect based on role
        navigate(role === 'admin' ? '/admin' : '/', { replace: true });
      } catch {
        localStorage.removeItem('token');
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" />
      <p className="text-gray-500 dark:text-gray-400 font-medium">Completing sign-in…</p>
    </div>
  );
};

export default AuthCallback;
