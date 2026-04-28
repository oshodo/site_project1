import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, BarChart2, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore, useCompareStore } from '../../utils/store';
import toast from 'react-hot-toast';

export function StarRating({ rating = 0, numReviews, size = 12 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        ))}
      </div>
      {numReviews !== undefined && <span className="text-xs text-gray-500">({numReviews})</span>}
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
      className="product-card bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-card-hover relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Action buttons */}
      <div className={`absolute top-2 right-2 flex flex-col gap-1.5 z-10 transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={(e) => { e.preventDefault(); if (!isLoggedIn()) { toast.error('Please login'); return; } toggle(product); }}
          className={`w-8 h-8 rounded-full shadow flex items-center justify-center text-xs transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'}`}>
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button onClick={(e) => { e.preventDefault(); addCompare(product); }}
          className="w-8 h-8 rounded-full shadow bg-white text-gray-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-colors">
          <BarChart2 size={14} />
        </button>
        <Link to={`/products/${product._id}`}
          className="w-8 h-8 rounded-full shadow bg-white text-gray-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-colors">
          <Eye size={14} />
        </Link>
      </div>

      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400'}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <h3 className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[32px] hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-primary-500 font-bold text-sm">NPR {product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">NPR {product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-500 mt-0.5">Only {product.stock} left!</p>
          )}
        </div>
      </Link>

      {/* Add to cart */}
      <div className={`transition-all duration-200 ${hovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <button
          onClick={() => { if (product.stock === 0) return; addItem(product, 1); }}
          disabled={product.stock === 0}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div className="skeleton aspect-square w-full" />
      <div className="p-2.5 space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:border-primary-500 hover:text-primary-500">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 border rounded text-sm transition-colors ${
            page === currentPage ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 hover:border-primary-500 hover:text-primary-500'
          }`}>
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:border-primary-500 hover:text-primary-500">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-5xl mb-3">{icon || '📦'}</div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-5">{message}</p>
      {action}
    </div>
  );
}

export function SectionHeader({ title, subtitle, link, linkText = 'See All' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-500 rounded-full inline-block" />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {link && (
        <a href={link} className="text-primary-500 text-xs font-semibold hover:underline flex items-center gap-1">
          {linkText} <ChevronRight size={12} />
        </a>
      )}
    </div>
  );
}
