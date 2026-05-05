// ============================================================
// client/src/utils/store.js  —  Zustand Global State (Fixed)
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ══════════════════════════════════════════════════════════════
// AUTH STORE
// ══════════════════════════════════════════════════════════════
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      updateUser: (updates) =>
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

// ══════════════════════════════════════════════════════════════
// CART STORE  —  FIX: itemCount and total are plain selectors
// ══════════════════════════════════════════════════════════════
export const useCartStore = create(
  persist(
    (set) => ({
      items: [], // [{ _id, name, price, quantity, image }]

      addItem: (product, qty = 1) =>
        set((state) => {
          const exists = state.items.find((i) => i._id === product._id);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i._id === product._id ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                _id:      product._id,
                name:     product.name,
                price:    product.price,
                image:    product.images?.[0]?.url || '',
                quantity: qty,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i._id !== id)
              : state.items.map((i) => (i._id === id ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-store' }
  )
);

// Selectors used in components — computed outside the store (reactive, correct)
export const selectCartTotal     = (state) => state.items.reduce((s, i) => s + i.price * i.quantity, 0);
export const selectCartItemCount = (state) => state.items.reduce((s, i) => s + i.quantity, 0);

// ══════════════════════════════════════════════════════════════
// WISHLIST STORE
// ══════════════════════════════════════════════════════════════
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),

      isWishlisted: (id) => get().ids.includes(id),
      clear:        ()   => set({ ids: [] }),
    }),
    { name: 'wishlist-store' }
  )
);

// ══════════════════════════════════════════════════════════════
// THEME STORE
// ══════════════════════════════════════════════════════════════
export const useThemeStore = create(
  persist(
    (set) => ({
      dark:   false,
      toggle: () => set((s) => ({ dark: !s.dark })),
    }),
    { name: 'theme-store' }
  )
);
