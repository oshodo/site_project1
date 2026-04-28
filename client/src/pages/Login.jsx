import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../utils/store';

const API_URL = import.meta.env.VITE_API_URL || 'https://sabaisales.onrender.com/api';

function GoogleButton({ label }) {
  return (
    <a href={`${API_URL}/auth/google`}
      className="flex items-center justify-center gap-3 w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium py-2.5 px-4 rounded transition-all text-sm hover:shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </a>
  );
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-500 rounded px-2 py-1">
              <span className="font-bold text-white text-xl">Sabai</span>
            </div>
            <span className="font-bold text-gray-800 text-xl">Sale</span>
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500 mb-5">Welcome back! Please enter your details.</p>

          {/* Google */}
          <GoogleButton label="Continue with Google" />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="input-field pl-9 pr-9" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded transition-colors text-sm disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs">
            <p className="font-semibold text-amber-700 mb-1.5">🔑 Demo Login:</p>
            <div className="flex gap-2">
              <button onClick={() => setForm({ email: 'jeevan@sabaisale.com', password: 'Jeevan@Sabaisale' })}
                className="flex-1 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-medium transition-colors">
                Try Admin
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">Create one</Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-500 hover:text-primary-500 flex items-center justify-center gap-1">
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { alert('Passwords do not match'); return; }
    const res = await register(form);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-500 rounded px-2 py-1">
              <span className="font-bold text-white text-xl">Sabai</span>
            </div>
            <span className="font-bold text-gray-800 text-xl">Sale</span>
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500 mb-5">Join thousands of happy shoppers!</p>

          <GoogleButton label="Sign up with Google" />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: showPw ? 'text' : 'password', placeholder: 'Min 6 characters' },
              { key: 'confirm', label: 'Confirm Password', type: showPw ? 'text' : 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{f.label}</label>
                <div className="relative">
                  <input type={f.type} required value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input-field"
                    minLength={f.key === 'password' ? 6 : undefined} />
                  {f.key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-gray-400">By registering you agree to our Terms of Service and Privacy Policy.</p>
            <button type="submit" disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded transition-colors text-sm disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-500 hover:text-primary-500 flex items-center justify-center gap-1">
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
