import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../utils/store';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('sabai_token', token);
      // Fetch user profile
      authAPI.getMe().then(({ data }) => {
        updateUser(data.user);
        toast.success(`Welcome, ${data.user.name}! 🎉`);
        navigate('/');
      }).catch(() => {
        toast.error('Authentication failed');
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-muted)] font-body">Signing you in with Google...</p>
      </div>
    </div>
  );
}
