import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { authAPI, cartAPI, wishlistAPI } from './api';

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login(credentials);
          localStorage.setItem('sabai_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome back, ${data.user.name}! 👋`);
          return { success: true, user: data.user };
        } catch (err) {
          set({ isLoading: false });
          const msg = err.response?.data?.message || 'Login failed';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(userData);
          localStorage.setItem('sabai_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome to SabaiSale, ${data.user.name}! 🎉`);
          return { success: true, user: data.user };
        } catch (err) {
          set({ isLoading: false });
          const msg = err.response?.data?.message || 'Registration failed';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      logout: () => {
        localStorage.removeItem('sabai_token');
        set({ user: null, token: null });
        toast.success('Logged out successfully');
      },

      updateUser: (user) => set({ user }),

      isAdmin: () => get().user?.role === 'admin',
      isLoggedIn: () => !!get().token,
    }),
    { name: 'sabai_auth', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
);

// ─── Cart Store ───────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const idx = items.findIndex(i => i.product._id === product._id);
    if (idx > -1) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
      set({ items: updated });
    } else {
      set({ items: [...items, { product, quantity }] });
    }
    toast.success(`${product.name} added to cart 🛒`);
  },

  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.product._id !== productId) });
    toast.success('Item removed from cart');
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) { get().removeItem(productId); return; }
    set({ items: get().items.map(i => i.product._id === productId ? { ...i, quantity } : i) });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
  getCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));

// ─── Wishlist Store ───────────────────────────────────────────────────────────
export const useWishlistStore = create((set, get) => ({
  items: [],

  toggle: (product) => {
    const items = get().items;
    const isIn = items.some(i => i._id === product._id);
    if (isIn) {
      set({ items: items.filter(i => i._id !== product._id) });
      toast.success('Removed from wishlist');
    } else {
      set({ items: [...items, product] });
      toast.success('Added to wishlist ❤️');
    }
  },

  isWishlisted: (productId) => get().items.some(i => i._id === productId),
  getCount: () => get().items.length,
}));

// ─── Theme Store ──────────────────────────────────────────────────────────────
export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const next = !get().isDark;
        document.documentElement.classList.toggle('dark', next);
        set({ isDark: next });
      },
      init: () => {
        const { isDark } = get();
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    { name: 'sabai_theme' }
  )
);

// ─── Recently Viewed Store ────────────────────────────────────────────────────
export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const items = get().items.filter(i => i._id !== product._id);
        set({ items: [product, ...items].slice(0, 8) });
      },
    }),
    { name: 'sabai_recently_viewed' }
  )
);

// ─── Compare Store ────────────────────────────────────────────────────────────
export const useCompareStore = create((set, get) => ({
  items: [],
  add: (product) => {
    const items = get().items;
    if (items.length >= 3) { toast.error('Max 3 products to compare'); return; }
    if (items.some(i => i._id === product._id)) { toast.error('Already added'); return; }
    set({ items: [...items, product] });
    toast.success('Added to compare ⚖️');
  },
  removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),
  clearAll: () => set({ items: [] }),
  isComparing: (id) => get().items.some(i => i._id === id),
}));
