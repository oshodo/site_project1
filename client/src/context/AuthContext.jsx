import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out')
  }

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData)
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
