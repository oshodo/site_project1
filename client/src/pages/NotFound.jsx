import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="font-display text-[120px] md:text-[180px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">404</div>
        <h1 className="font-display text-3xl font-bold text-[var(--text)] -mt-6 mb-3">Page Not Found</h1>
        <p className="text-[var(--text-muted)] mb-8 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-ghost">Browse Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
