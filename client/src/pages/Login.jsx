import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../utils/store';

const API_URL = import.meta.env.VITE_API_URL || 'https://sabaisales.onrender.com/api';
const GOOGLE_AUTH_URL = `${API_URL}/auth/google`;

// ─── Google Button Component ──────────────────────────────────────────────────
function GoogleButton({ label = 'Continue with Google' }) {
  return (
    <motion.a
      href={GOOGLE_AUTH_URL}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex items-center justify-center gap-3 w-full border-2 border-[var(--border)] hover:border-gray-400 bg-[var(--bg-card)] text-[var(--text)] font-semibold py-3 px-4 rounded-xl transition-all duration-200"
    >
      {/* Google SVG Icon */}
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </motion.a>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[var(--border)]" />
      <span className="text-xs text-[var(--text-muted)] font-medium">OR</span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-[var(--bg)] overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-primary-500 mb-8 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">S</span>
            </div>
            <span className="font-display font-bold text-2xl text-[var(--text)]">Sabai<span className="text-primary-500">Sale</span></span>
          </div>

          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-1">Welcome back</h1>
          <p className="text-[var(--text-muted)] mb-6">Sign in to continue shopping.</p>

          {/* Google Login */}
          <GoogleButton label="Sign in with Google" />
          <Divider />

          {/* Email Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary-500">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">🔑 Demo Credentials:</p>
            <div className="flex gap-2">
              {[
                { label: 'Admin', email: 'admin@sabaisale.com', pw: 'Jeevan@Sabaisale' },
              ].map(c => (
                <button key={c.label} onClick={() => setForm({ email: c.email, password: c.pw })}
                  className="flex-1 text-xs py-1.5 px-2 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 text-amber-800 dark:text-amber-300 rounded-lg transition-colors">
                  Try {c.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">Create one →</Link>
          </p>
        </div>
      </div>

      {/* Right Hero Image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-white font-display text-2xl font-bold leading-snug">
            "Nepal's most trusted premium shopping destination."
          </blockquote>
          <p className="text-white/70 text-sm mt-3">— 10,000+ satisfied customers</p>
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex">
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-[var(--bg)] overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-primary-500 mb-8 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">S</span>
            </div>
            <span className="font-display font-bold text-2xl text-[var(--text)]">Sabai<span className="text-primary-500">Sale</span></span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-1">Create account</h1>
          <p className="text-[var(--text-muted)] mb-6">Join thousands of happy shoppers in Nepal.</p>

          {/* Google Register */}
          <GoogleButton label="Sign up with Google" />
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jeevan Don' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: showPw ? 'text' : 'password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm Password', type: showPw ? 'text' : 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2">{field.label}</label>
                <div className="relative">
                  <input type={field.type} required value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder} className="input-field"
                    minLength={field.key === 'password' ? 6 : undefined} />
                  {field.key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>
          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
