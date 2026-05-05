// client/src/components/common/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCartStore, useWishlistStore, useAuthStore } from '../../utils/store';
import { wishlistAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem        = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { user }       = useAuthStore();
  const wished         = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save wishlist'); return; }
    toggle(product._id);
    try {
      await wishlistAPI.toggle(product._id);
    } catch {
      toggle(product._id); // revert on error
    }
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          {/* Featured badge */}
          {product.isFeatured && (
            <span className="absolute top-2 right-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              ⭐ Featured
            </span>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className={wished ? 'text-red-500' : 'text-gray-300'}>♥</span>
          </button>
          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/70 px-3 py-1 rounded-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1">
              {product.category?.name}
            </p>
          )}
          <h3 className="font-semibold text-sm dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="text-xs text-gray-400">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-gray-900 dark:text-white">
              NPR {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                NPR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
