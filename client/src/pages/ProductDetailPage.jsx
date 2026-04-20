import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiStar, FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id }         = useParams()
  const { addToCart }  = useCart()
  const { user }       = useAuth()

  const [product, setProduct]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [selImage, setSelImage]   = useState(0)
  const [qty, setQty]             = useState(1)
  const [review, setReview]       = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => toast.error('Product not found')).finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    addToCart(product, qty)
    toast.success(`${qty} item(s) added to cart!`)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!review.comment.trim()) return toast.error('Please write a comment')
    setSubmitting(true)
    try {
      await api.post(`/products/${id}/review`, review)
      toast.success('Review submitted!')
      const { data } = await api.get(`/products/${id}`)
      setProduct(data)
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-xl" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
    </div>
  )

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-6">
        <FiArrowLeft size={14} /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="card overflow-hidden mb-3 aspect-square">
            <img
              src={product.images?.[selImage] || 'https://placehold.co/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${selImage === i ? 'border-orange-500' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex gap-2 mb-2">
            {product.brand && <span className="badge bg-gray-100 text-gray-600">{product.brand}</span>}
            <span className="badge bg-orange-100 text-orange-600">{product.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={16} className={s <= Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {discount > 0 && <>
              <span className="text-lg text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
              <span className="badge bg-red-100 text-red-600">-{discount}% OFF</span>
            </>}
          </div>

          {/* Stock */}
          <p className={`text-sm mb-4 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Qty + Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-lg font-bold">−</button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 text-lg font-bold">+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
            {[
              [FiTruck,    'Free Delivery', 'Orders > $100'],
              [FiShield,   'Genuine Item',  '100% authentic'],
              [FiRefreshCw,'Easy Returns',  '30-day policy'],
            ].map(([Icon, title, sub]) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto text-orange-500 mb-1" size={18} />
                <p className="text-xs font-medium text-gray-700">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* Write Review */}
        {user && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Your Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))}>
                      <FiStar size={24} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Comment</label>
                <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                  rows={4} className="input-field resize-none" placeholder="Share your experience..." />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Reviews ({product.numReviews})</h3>
          {product.reviews?.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {product.reviews?.map(r => (
                <div key={r._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                      {r.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                    <div className="flex ml-1">
                      {[1,2,3,4,5].map(s => <FiStar key={s} size={11} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
