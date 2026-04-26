import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Minus, Plus, Check, AlertCircle, Share2, BarChart2, ZoomIn } from 'lucide-react';
import { productsAPI, reviewsAPI } from '../utils/api';
import { useCartStore, useWishlistStore, useAuthStore, useRecentlyViewedStore, useCompareStore } from '../utils/store';
import { StarRating, ProductCard, SkeletonCard } from '../components/common/index';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { user, isLoggedIn } = useAuthStore();
  const { add: addRecentlyViewed } = useRecentlyViewedStore();
  const recentlyViewed = useRecentlyViewedStore(s => s.items);
  const { add: addCompare, isComparing } = useCompareStore();

  useEffect(() => {
    setLoading(true); setImgIdx(0); setQty(1);
    Promise.all([productsAPI.getById(id), reviewsAPI.getByProduct(id)])
      .then(([p, r]) => {
        setProduct(p.data.product); setReviews(r.data.reviews);
        addRecentlyViewed(p.data.product);
        if (p.data.product.category) {
          productsAPI.getAll({ category: p.data.product.category._id || p.data.product.category, limit: 4 })
            .then(rel => setRelated(rel.data.products.filter(rp => rp._id !== id)));
        }
      }).catch(() => navigate('/products')).finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) { toast.error('Please login to write a review'); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewsAPI.create({ productId: id, ...reviewForm });
      setReviews(prev => [data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const images = product?.images?.length ? product.images : [product?.image].filter(Boolean);

  if (loading) return (
    <div className="pt-24 pb-16"><div className="container-custom"><div className="grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="skeleton aspect-square rounded-2xl" />
      <div className="space-y-4 pt-4">{[80,60,40,100,50].map((w,i) => <div key={i} className="skeleton h-5 rounded" style={{width:`${w}%`}} />)}</div>
    </div></div></div>
  );
  if (!product) return null;

  const wishlisted = isWishlisted(product._id);
  const comparing = isComparing(product._id);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary-500">Products</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--text)] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative card overflow-hidden aspect-square mb-3 bg-gray-50 dark:bg-gray-900 cursor-zoom-in" onClick={() => setZoomed(true)}>
              <AnimatePresence mode="wait">
                <motion.img key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  src={images[imgIdx] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600'}
                  alt={product.name} className="w-full h-full object-contain p-6"
                />
              </AnimatePresence>
              <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-1.5 rounded-lg"><ZoomIn size={16} className="text-[var(--text-muted)]" /></div>
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i-1+images.length)%images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-md"><ChevronLeft size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i+1)%images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-md"><ChevronRight size={18} /></button>
                </>
              )}
              {product.discount > 0 && <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm">-{product.discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i===imgIdx ? 'border-primary-500 shadow-glow' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.brand && <span className="badge bg-primary-50 dark:bg-primary-950 text-primary-600">{product.brand}</span>}
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-bold text-[var(--text)] leading-tight">{product.name}</h1>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={handleShare} className="p-2.5 rounded-xl border border-[var(--border)] hover:border-primary-400 text-[var(--text-muted)] hover:text-primary-500 transition-all"><Share2 size={18} /></button>
                <button onClick={() => addCompare(product)} className={`p-2.5 rounded-xl border-2 transition-all ${comparing ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-500' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-primary-500'}`}><BarChart2 size={18} /></button>
              </div>
            </div>
            <StarRating rating={product.rating} numReviews={product.numReviews} size={16} />
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-[var(--text)]">NPR {product.price?.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <><span className="text-xl text-[var(--text-muted)] line-through">NPR {product.originalPrice?.toLocaleString()}</span>
                <span className="badge bg-red-100 dark:bg-red-950 text-red-600">Save {product.discount}%</span></>
              )}
            </div>
            <div className={`flex items-center gap-2 text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock > 0 ? <><Check size={16} /> In Stock ({product.stock} available)</> : <><AlertCircle size={16} /> Out of Stock</>}
            </div>
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[var(--text-muted)]">Quantity:</span>
                <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1,q-1))} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Minus size={16} /></button>
                  <span className="px-5 py-3 font-semibold text-[var(--text)] min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock,q+1))} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => addItem(product, qty)} disabled={product.stock===0} className="flex-1 btn-secondary flex items-center justify-center gap-2"><ShoppingCart size={18} />{product.stock===0 ? 'Out of Stock' : 'Add to Cart'}</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { addItem(product,qty); navigate('/cart'); }} disabled={product.stock===0} className="flex-1 btn-primary flex items-center justify-center gap-2">Buy Now</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggle(product)} className={`p-3.5 rounded-xl border-2 transition-all ${wishlisted ? 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-500' : 'border-[var(--border)] hover:border-rose-300 text-[var(--text-muted)] hover:text-rose-500'}`}>
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[[Truck,'Free Delivery','Orders > NPR 5K'],[Shield,'Authentic','100% genuine'],[RotateCcw,'7-day Return','Hassle-free']].map(([Icon,title,sub]) => (
                <div key={title} className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Icon size={18} className="text-primary-500 mb-1.5" />
                  <p className="text-xs font-semibold text-[var(--text)]">{title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-[var(--border)] gap-1">
            {['description','specifications','reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab===t ? 'border-primary-500 text-primary-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'}`}>{t}</button>
            ))}
          </div>
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {tab==='description' && (
                <motion.div key="desc" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
                  <p className="text-[var(--text-muted)] leading-relaxed text-base max-w-3xl">{product.description}</p>
                  {product.tags?.length > 0 && <div className="flex flex-wrap gap-2 mt-6">{product.tags.map(tag => <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)]">#{tag}</span>)}</div>}
                </motion.div>
              )}
              {tab==='specifications' && (
                <motion.div key="specs" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
                  {product.specifications?.length > 0 ? (
                    <div className="divide-y divide-[var(--border)] max-w-xl">
                      {product.specifications.map((s,i) => <div key={i} className="flex py-3 text-sm"><span className="w-40 font-medium text-[var(--text-muted)]">{s.key}</span><span className="text-[var(--text)]">{s.value}</span></div>)}
                    </div>
                  ) : <p className="text-[var(--text-muted)]">No specifications available.</p>}
                </motion.div>
              )}
              {tab==='reviews' && (
                <motion.div key="revs" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[var(--text)] mb-5">Customer Reviews ({reviews.length})</h3>
                    {reviews.length===0 ? <p className="text-[var(--text-muted)]">No reviews yet. Be the first!</p> : (
                      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                        {reviews.map(r => (
                          <div key={r._id} className="card p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-950 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">{r.user?.name?.[0]?.toUpperCase()}</div>
                              <div><p className="font-semibold text-sm text-[var(--text)]">{r.user?.name}</p><p className="text-xs text-[var(--text-muted)]">{new Date(r.createdAt).toLocaleDateString()}</p></div>
                              <div className="ml-auto"><StarRating rating={r.rating} /></div>
                            </div>
                            {r.title && <p className="font-semibold text-sm text-[var(--text)] mb-1">{r.title}</p>}
                            <p className="text-sm text-[var(--text-muted)]">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[var(--text)] mb-5">Write a Review</h3>
                    {!isLoggedIn() ? (
                      <div className="card p-6 text-center"><p className="text-[var(--text-muted)] mb-4">Please login to write a review</p><Link to="/login" className="btn-primary">Login</Link></div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="card p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Your Rating</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <button key={s} type="button" onClick={() => setReviewForm(f=>({...f,rating:s}))} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
                                <Star size={28} className={`transition-colors ${s<=(hoverRating||reviewForm.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <input value={reviewForm.title} onChange={e => setReviewForm(f=>({...f,title:e.target.value}))} placeholder="Review title (optional)" className="input-field" />
                        <textarea value={reviewForm.comment} onChange={e => setReviewForm(f=>({...f,comment:e.target.value}))} required rows={4} placeholder="Share your experience..." className="input-field resize-none" />
                        <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Submitting...' : 'Submit Review'}</button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{related.map((p,i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.filter(p => p._id !== id).length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{recentlyViewed.filter(p=>p._id!==id).slice(0,4).map((p,i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <motion.img initial={{ scale:0.9 }} animate={{ scale:1 }} exit={{ scale:0.9 }}
              src={images[imgIdx]} alt={product.name}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
