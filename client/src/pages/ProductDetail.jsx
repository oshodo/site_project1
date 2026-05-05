// client/src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productAPI } from '../utils/api';
import { useCartStore, useAuthStore, useWishlistStore } from '../utils/store';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProductDetail = () => {
  const { id }  = useParams();
  const { user } = useAuthStore();
  const addItem  = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  const [product,  setProduct]   = useState(null);
  const [loading,  setLoading]   = useState(true);
  const [qty,      setQty]       = useState(1);
  const [selImg,   setSelImg]    = useState(0);
  const [review,   setReview]    = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [tab,      setTab]       = useState('description');

  useEffect(() => {
    (async () => {
      try {
        const res = await productAPI.getById(id);
        setProduct(res.data.data);
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty}× ${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    setSubmitting(true);
    try {
      await productAPI.addReview(id, review);
      toast.success('Review submitted!');
      const res = await productAPI.getById(id);
      setProduct(res.data.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="dark:text-white text-lg">Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-orange-500">Home</Link> /
          <Link to="/products" className="hover:text-orange-500 mx-1">Products</Link> /
          <span className="text-gray-600 dark:text-gray-300"> {product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Images ──────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <img
                src={product.images?.[selImg]?.url || 'https://placehold.co/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${selImg === i ? 'border-orange-500' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ────────────────────────────────────────── */}
          <div className="space-y-5">
            {product.category && (
              <Link to={`/products?category=${product.category._id}`}
                className="text-sm text-orange-500 font-medium uppercase tracking-wide hover:underline">
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl font-extrabold dark:text-white leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-orange-500">NPR {product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">NPR {product.originalPrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">-{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Brand & Stock */}
            <div className="flex gap-6 text-sm dark:text-gray-300">
              {product.brand && <span>🏷️ Brand: <strong>{product.brand}</strong></span>}
              <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                {product.stock > 0 ? `✅ In Stock (${product.stock} left)` : '❌ Out of Stock'}
              </span>
            </div>

            {/* Qty + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center border dark:border-gray-600 rounded-xl overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-lg font-bold">−</button>
                  <span className="w-12 text-center font-semibold dark:text-white">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-lg font-bold">+</button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1 py-3 text-base">
                  🛒 Add to Cart
                </button>
                <button onClick={() => toggle(product._id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-colors ${isWishlisted(product._id) ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 dark:border-gray-600 hover:border-red-400 dark:text-white'}`}>
                  ♥
                </button>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b dark:border-gray-700 mb-6">
            {['description', 'reviews'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {t} {t === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="card p-6 prose dark:prose-invert max-w-none">
              <p className="dark:text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-6">
              {/* Write review */}
              {user && (
                <div className="card p-6">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((r) => (
                          <button key={r} type="button" onClick={() => setReview((v) => ({ ...v, rating: r }))}
                            className={`text-2xl transition-transform hover:scale-110 ${r <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Comment</label>
                      <textarea rows={3} value={review.comment} onChange={(e) => setReview((v) => ({ ...v, comment: e.target.value }))} required
                        className="input resize-none" placeholder="Share your experience with this product..." />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Review list */}
              {product.reviews?.length === 0 ? (
                <div className="card p-10 text-center text-gray-400">
                  <p className="text-4xl mb-3">💬</p>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((r) => (
                    <div key={r._id} className="card p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center font-bold text-orange-600 shrink-0">
                          {r.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold dark:text-white">{r.name}</p>
                            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{r.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
