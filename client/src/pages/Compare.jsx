import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { StarRating } from '../components/common/index';
import { useCompareStore } from '../utils/store';

export default function Compare() {
  const { items, removeItem, clearAll } = useCompareStore();

  if (items.length === 0) return (
    <div className="pt-24 pb-16">
      <div className="container-custom text-center py-20">
        <div className="text-6xl mb-4">⚖️</div>
        <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-2">No Products to Compare</h2>
        <p className="text-[var(--text-muted)] mb-6">Add products from the product page to compare them.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const allKeys = ['price', 'brand', 'rating', 'stock', 'description'];

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Compare Products</h1>
          <button onClick={clearAll} className="btn-ghost text-sm text-red-500 hover:text-red-600">Clear All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <td className="w-40 pr-4 py-3 text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Feature</td>
                {items.map(p => (
                  <td key={p._id} className="px-4 py-3 text-center">
                    <div className="card p-4 relative">
                      <button onClick={() => removeItem(p._id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <X size={14} className="text-[var(--text-muted)]" />
                      </button>
                      <img src={p.image} alt={p.name} className="w-24 h-24 object-contain mx-auto mb-3" />
                      <Link to={`/products/${p._id}`} className="font-semibold text-sm text-[var(--text)] hover:text-primary-500 line-clamp-2">{p.name}</Link>
                    </div>
                  </td>
                ))}
                {items.length < 3 && (
                  <td className="px-4 py-3 text-center">
                    <Link to="/products" className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-[var(--border)] rounded-2xl hover:border-primary-400 transition-colors text-[var(--text-muted)] hover:text-primary-500">
                      <Plus size={24} className="mb-2" /><span className="text-sm">Add Product</span>
                    </Link>
                  </td>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="pr-4 py-4 text-sm font-semibold text-[var(--text-muted)]">Price</td>
                {items.map(p => (
                  <td key={p._id} className="px-4 py-4 text-center">
                    <span className="font-display font-bold text-lg text-[var(--text)]">NPR {p.price?.toLocaleString()}</span>
                    {p.originalPrice > p.price && <p className="text-xs text-[var(--text-muted)] line-through">NPR {p.originalPrice?.toLocaleString()}</p>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="pr-4 py-4 text-sm font-semibold text-[var(--text-muted)]">Rating</td>
                {items.map(p => (
                  <td key={p._id} className="px-4 py-4 text-center">
                    <div className="flex justify-center"><StarRating rating={p.rating} numReviews={p.numReviews} /></div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="pr-4 py-4 text-sm font-semibold text-[var(--text-muted)]">Brand</td>
                {items.map(p => <td key={p._id} className="px-4 py-4 text-center text-sm text-[var(--text)]">{p.brand || '—'}</td>)}
              </tr>
              <tr>
                <td className="pr-4 py-4 text-sm font-semibold text-[var(--text-muted)]">Stock</td>
                {items.map(p => (
                  <td key={p._id} className="px-4 py-4 text-center">
                    <span className={`badge text-xs ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="pr-4 py-4 text-sm font-semibold text-[var(--text-muted)]">Description</td>
                {items.map(p => <td key={p._id} className="px-4 py-4 text-center text-xs text-[var(--text-muted)] max-w-[200px]">{p.description}</td>)}
              </tr>
              <tr>
                <td className="pr-4 py-4"></td>
                {items.map(p => (
                  <td key={p._id} className="px-4 py-4 text-center">
                    <Link to={`/products/${p._id}`} className="btn-primary text-sm py-2 block">View Product</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
