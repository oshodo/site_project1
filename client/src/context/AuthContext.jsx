import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user from localStorage on app start
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Error parsing user from localStorage', err)
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  // LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      throw err // LoginPage मा handle हुन्छ
    }
  }

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      throw err
    }
  }

  // LOGOUT
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  // UPDATE PROFILE
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData)
      const updatedUser = { ...user, ...data }

      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      toast.success('Profile updated')
      return updatedUser
    } catch (err) {
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)
