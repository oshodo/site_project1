// Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../utils/store';

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
      {/* Left – Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-[var(--bg)]">
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

          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Welcome back</h1>
          <p className="text-[var(--text-muted)] mb-8">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary-500"
                >{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base"
            >{isLoading ? 'Signing in...' : 'Sign In'}</motion.button>
          </form>

          {/* Demo creds */}
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Demo Credentials:</p>
            <div className="flex gap-2">
              {[
                { label: 'Admin', email: 'admin@sabaisale.com', pw: 'Jeevan@Sabaisale' },
                { label: 'User', email: 'user@example.com', pw: 'password123' },
              ].map(c => (
                <button key={c.label} onClick={() => setForm({ email: c.email, password: c.pw })}
                  className="flex-1 text-xs py-1.5 px-2 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-300 rounded-lg transition-colors"
                >Try {c.label}</button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">Create one →</Link>
          </p>
        </div>
      </div>
      {/* Right – Hero Image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-white font-display text-2xl font-bold leading-snug">
            "The best place to shop premium products in Nepal."
          </blockquote>
          <p className="text-white/70 text-sm mt-3">— 10,000+ satisfied customers</p>
        </div>
      </div>
    </div>
  );
}

// Register.jsx
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
          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Create account</h1>
          <p className="text-[var(--text-muted)] mb-8">Join thousands of happy shoppers in Nepal.</p>
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
                    minLength={field.key === 'password' ? 6 : undefined}
                  />
                  {field.key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    >{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  )}
                </div>
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base"
            >{isLoading ? 'Creating account...' : 'Create Account'}</motion.button>
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
