import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore, useCompareStore } from '../../utils/store';
import toast from 'react-hot-toast';

// ─── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ rating = 0, numReviews, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(star => (
          <Star key={star} size={size}
            className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
        ))}
      </div>
      {numReviews !== undefined && <span className="text-xs text-[var(--text-muted)]">({numReviews})</span>}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
export function ProductCard({ product, index = 0 }) {
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { add: addCompare, isComparing } = useCompareStore();
  const { isLoggedIn } = useAuthStore();
  const wishlisted = isWishlisted(product._id);
  const comparing = isComparing(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isLoggedIn()) { toast.error('Please login to save wishlist'); return; }
    toggle(product);
  };

  const handleAddCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    addCompare(product);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
      <Link to={`/products/${product._id}`} className="group block card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
            {product.featured && <span className="badge bg-primary-500 text-white">Featured</span>}
            {product.stock === 0 && <span className="badge bg-gray-800 text-gray-200">Out of Stock</span>}
          </div>
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleWishlist}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors ${
                wishlisted ? 'bg-rose-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-rose-500 hover:text-white'
              }`}
            ><Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCompare}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors ${
                comparing ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-primary-500 hover:text-white'
              }`}
            ><BarChart2 size={15} /></motion.button>
          </div>
          {/* Add to cart bar */}
          <div onClick={handleAddCart}
            className="absolute bottom-0 left-0 right-0 bg-primary-500 py-2.5 px-4 flex items-center justify-center gap-2 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 cursor-pointer z-10">
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-primary-500 font-semibold uppercase tracking-wide mb-1">{product.brand || 'SabaiSale'}</p>
          <h3 className="font-body font-semibold text-[var(--text)] line-clamp-2 text-sm mb-2 group-hover:text-primary-500 transition-colors">{product.name}</h3>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          <div className="flex items-center gap-2 mt-3">
            <span className="font-display font-bold text-lg text-[var(--text)]">NPR {product.price?.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-[var(--text-muted)] line-through">NPR {product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/3 rounded" />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 rounded-xl btn-ghost disabled:opacity-40"><ChevronLeft size={18} /></button>
      {pages.map((page, i) => (
        page === '...' ? <span key={i} className="px-2 text-[var(--text-muted)]">...</span> : (
          <button key={page} onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${page === currentPage ? 'bg-primary-500 text-white shadow-glow' : 'btn-ghost'}`}
          >{page}</button>
        )
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 rounded-xl btn-ghost disabled:opacity-40"><ChevronRight size={18} /></button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-6xl mb-4">{icon || '📦'}</div>
      <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] mb-6">{message}</p>
      {action}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle, centered = true }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-2">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className={`section-subtitle mt-3 ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </div>
  );
}
