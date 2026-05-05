// ============================================================
// client/src/utils/api.js — Axios instance with auth interceptor
// ============================================================
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Attach JWT to every request if available ────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Global error handler: auto-logout on 401 ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ══════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  getMe:          ()     => api.get('/auth/me'),
  updateProfile:  (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ══════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════
export const productAPI = {
  getAll:    (params) => api.get('/products', { params }),
  getById:   (id)     => api.get(`/products/${id}`),
  create:    (data)   => api.post('/products', data),
  update:    (id, data) => api.put(`/products/${id}`, data),
  remove:    (id)     => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

// ══════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════
export const categoryAPI = {
  getAll:  ()         => api.get('/categories'),
  create:  (data)     => api.post('/categories', data),
  update:  (id, data) => api.put(`/categories/${id}`, data),
  remove:  (id)       => api.delete(`/categories/${id}`),
};

// ══════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════
export const orderAPI = {
  create:       (data) => api.post('/orders', data),
  getMyOrders:  (params) => api.get('/orders/my', { params }),
  getById:      (id)   => api.get(`/orders/${id}`),
  // Admin
  getAll:       (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// ══════════════════════════════════════════════════════════════
// UPLOAD (Cloudinary)
// ══════════════════════════════════════════════════════════════
export const uploadAPI = {
  // formData must be a FormData object with field name 'image'
  uploadOne:      (formData) =>
    api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadMultiple: (formData) =>
    api.post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:    (publicId) =>
    api.delete(`/upload/${encodeURIComponent(publicId)}`),
};

// ══════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════
export const adminAPI = {
  getDashboard: ()         => api.get('/admin/dashboard'),
  getUsers:     (params)   => api.get('/admin/users', { params }),
  updateUser:   (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser:   (id)       => api.delete(`/admin/users/${id}`),
};

// ══════════════════════════════════════════════════════════════
// WISHLIST
// ══════════════════════════════════════════════════════════════
export const wishlistAPI = {
  get:    ()    => api.get('/wishlist'),
  toggle: (id)  => api.post(`/wishlist/toggle/${id}`),
};

// ══════════════════════════════════════════════════════════════
// CART VALIDATION
// ══════════════════════════════════════════════════════════════
export const cartAPI = {
  validate: (items) => api.post('/cart/validate', { items }),
};

export default api;
