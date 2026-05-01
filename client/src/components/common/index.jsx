import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, BarChart2, Eye, ArrowRight } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore, useCompareStore } from '../../utils/store';
import toast from 'react-hot-toast';

export function StarRating({ rating = 0, numReviews, size = 11 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={size}
            className={s <= Math.round(rating) ? 'text-accent-400 fill-accent-400' : 'text-gray-200 dark:text-gray-700'}
          />
        ))}
      </div>
      {numReviews !== undefined && <span className="text-[10px] text-[var(--text-muted)]">({numReviews})</span>}
    </div>
  );
}

export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { add: addCompare } = useCompareStore();
  const { isLoggedIn } = useAuthStore();
  const wishlisted = isWishlisted(product._id);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div
      className="product-card bg-white dark:bg-[#141414] border border-[var(--border)] overflow-hidden group relative"
      style={{ borderRadius: '2px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Action Buttons */}
      <div className={`absolute top-3 right-3 flex flex-col gap-1.5 z-10 transition-all duration-200 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <button
          onClick={e => { e.preventDefault(); if (!isLoggedIn()) { toast.error('Please login'); return; } toggle(product); }}
          className={`w-8 h-8 flex items-center justify-center border shadow-soft transition-all duration-200 ${
            wishlisted ? 'bg-[#111111] border-[#111111] text-white' : 'bg-white dark:bg-[#1a1a1a] border-[var(--border)] text-[var(--text-muted)] hover:border-[#111111] hover:text-[#111111] dark:hover:border-white dark:hover:text-white'
          }`} style={{ borderRadius: '2px' }}>
          <Heart size={13} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={e => { e.preventDefault(); addCompare(product); }}
          className="w-8 h-8 flex items-center justify-center border border-[var(--border)] bg-white dark:bg-[#1a1a1a] text-[var(--text-muted)] hover:border-[#111111] hover:text-[#111111] dark:hover:border-white dark:hover:text-white shadow-soft transition-all duration-200"
          style={{ borderRadius: '2px' }}>
          <BarChart2 size={13} strokeWidth={1.5} />
        </button>
        <Link to={`/products/${product._id}`}
          className="w-8 h-8 flex items-center justify-center border border-[var(--border)] bg-white dark:bg-[#1a1a1a] text-[var(--text-muted)] hover:border-[#111111] hover:text-[#111111] dark:hover:border-white dark:hover:text-white shadow-soft transition-all duration-200"
          style={{ borderRadius: '2px' }}>
          <Eye size={13} strokeWidth={1.5} />
        </Link>
      </div>

      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">
          <img
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400'}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase" style={{ borderRadius: '2px' }}>
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-accent-400 text-white text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase" style={{ borderRadius: '2px' }}>
                Featured
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/50 flex items-center justify-center">
              <span className="text-[var(--text-muted)] text-xs font-semibold tracking-widest uppercase">Sold Out</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 pb-2">
          <p className="text-[10px] text-[var(--text-muted)] font-semibold tracking-widest uppercase mb-1">{product.brand || 'SabaiSale'}</p>
          <h3 className="text-xs text-[var(--text)] line-clamp-2 leading-relaxed min-h-[32px] group-hover:text-accent-500 transition-colors">{product.name}</h3>
          <div className="mt-1.5"><StarRating rating={product.rating} numReviews={product.numReviews} /></div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm font-bold text-[var(--text)]">NPR {product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-[var(--text-muted)] line-through">NPR {product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[10px] text-accent-400 mt-1 font-semibold">Only {product.stock} left</p>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <div className={`transition-all duration-300 overflow-hidden ${hovered ? 'max-h-12' : 'max-h-0'}`}>
        <button
          onClick={() => { if (product.stock > 0) addItem(product, 1); }}
          disabled={product.stock === 0}
          className="w-full bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-gray-100 text-white dark:text-[#111111] text-xs font-semibold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-40 tracking-wide"
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#141414] border border-[var(--border)]" style={{ borderRadius: '2px' }}>
      <div className="skeleton aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-2 w-1/3 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded mt-1" />
      </div>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 7); i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] disabled:opacity-30 transition-all"
        style={{ borderRadius: '2px' }}>
        <ChevronLeft size={15} strokeWidth={1.5} />
      </button>
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`w-9 h-9 flex items-center justify-center text-xs font-semibold border transition-all ${
            page === currentPage
              ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#111111]'
              : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
          }`} style={{ borderRadius: '2px' }}>
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] disabled:opacity-30 transition-all"
        style={{ borderRadius: '2px' }}>
        <ChevronRight size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-5xl mb-4">{icon || '📦'}</div>
      <h3 className="font-semibold text-[var(--text)] mb-2 tracking-wide">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">{message}</p>
      {action}
    </div>
  );
}

export function SectionHeader({ label, title, link, linkText = 'View All' }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {label && <p className="section-label mb-2">{label}</p>}
        <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors group">
          {linkText} <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
