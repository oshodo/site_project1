import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()
  const from         = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@sabaisale.com', password: 'admin123' })
    else                  setForm({ email: 'john@example.com',    password: 'user123'  })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              Sabai<span className="text-gray-800">Sale</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800 mt-3">Sign in to your account</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Please enter your details.</p>
          </div>

          {/* Demo buttons */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => fillDemo('user')}
              className="flex-1 text-xs py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              👤 Demo User
            </button>
            <button onClick={() => fillDemo('admin')}
              className="flex-1 text-xs py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-orange-600">
              🔑 Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
