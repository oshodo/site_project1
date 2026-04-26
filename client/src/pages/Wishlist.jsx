import { Link } from 'react-router-dom';
import { useWishlistStore } from '../utils/store';
import { ProductCard, EmptyState } from '../components/common/index';

export default function Wishlist() {
  const { items } = useWishlistStore();
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">
          My Wishlist <span className="text-[var(--text-muted)] text-xl font-normal">({items.length})</span>
        </h1>
        {items.length === 0
          ? <EmptyState icon="❤️" title="Your wishlist is empty" message="Save items you love for later."
              action={<Link to="/products" className="btn-primary">Browse Products</Link>} />
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
        }
      </div>
    </div>
  );
}
