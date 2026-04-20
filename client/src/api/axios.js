import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Attach JWT token to every request if present
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// Global error handling
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
