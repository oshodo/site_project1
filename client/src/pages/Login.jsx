import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuthStore } from '../utils/store';

const API_URL = import.meta.env.VITE_API_URL || 'https://sabaisale.onrender.com/api';

function GoogleButton({ label }) {
  return (
    <a href={`${API_URL}/auth/google`}
      className="flex items-center justify-center gap-3 w-full border border-[var(--border)] hover:border-[var(--text)] bg-white dark:bg-[#1a1a1a] text-[var(--text)] font-medium py-3 px-4 transition-all text-sm hover:shadow-soft"
      style={{ borderRadius: '2px' }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
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
    if (res.success) {
      if (res.user?.role === 'admin') navigate('/admin', { replace: true });
      else navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="max-w-sm w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-[#111111] dark:bg-white flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <Sparkles size={13} className="text-white dark:text-[#111111]" strokeWidth={2}/>
            </div>
            <span className="font-bold text-[#111111] dark:text-white tracking-tight">Sabai<span className="text-accent-400">Sale</span></span>
          </Link>

          <p className="section-label mb-3">Welcome Back</p>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1">Sign In</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Enter your credentials to continue shopping.</p>

          <GoogleButton label="Continue with Google" />

          <div className="divider-accent my-6 text-xs text-[var(--text-muted)]">or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-10"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="input-field pl-10 pr-10"/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  {showPw ? <EyeOff size={14} strokeWidth={1.5}/> : <Eye size={14} strokeWidth={1.5}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 tracking-wide">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            New to SabaiSale?{' '}
            <Link to="/register" className="text-[var(--text)] font-semibold hover:text-accent-500 transition-colors">Create account →</Link>
          </p>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900" alt="" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/10"/>
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-2">Customer Review</p>
          <blockquote className="text-white font-semibold text-lg leading-snug">"Best shopping experience in Nepal. Fast delivery, genuine products."</blockquote>
          <p className="text-white/50 text-xs mt-3">— 10,000+ satisfied customers</p>
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
    <div className="min-h-screen bg-[var(--bg)] flex">
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900" alt="" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-[#0a0a0a]/30"/>
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-12 overflow-y-auto">
        <div className="max-w-sm w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-[#111111] dark:bg-white flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <Sparkles size={13} className="text-white dark:text-[#111111]" strokeWidth={2}/>
            </div>
            <span className="font-bold text-[#111111] dark:text-white tracking-tight">Sabai<span className="text-accent-400">Sale</span></span>
          </Link>

          <p className="section-label mb-3">Join Us</p>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1">Create Account</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Join thousands of happy shoppers in Nepal.</p>

          <GoogleButton label="Sign up with Google" />
          <div className="divider-accent my-6 text-xs text-[var(--text-muted)]">or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: showPw ? 'text' : 'password', placeholder: 'Min 6 characters' },
              { key: 'confirm', label: 'Confirm Password', type: showPw ? 'text' : 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[var(--text)] tracking-wide mb-1.5">{f.label}</label>
                <div className="relative">
                  <input type={f.type} required value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input-field" minLength={f.key === 'password' ? 6 : undefined}/>
                  {f.key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                      {showPw ? <EyeOff size={14} strokeWidth={1.5}/> : <Eye size={14} strokeWidth={1.5}/>}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 tracking-wide">
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--text)] font-semibold hover:text-accent-500 transition-colors">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
