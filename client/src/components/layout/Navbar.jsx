import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiShoppingCart, FiUser, FiSearch, FiMenu, FiX,
  FiPackage, FiLogOut, FiSettings, FiChevronDown
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout }  = useAuth()
  const { cartCount }     = useCart()
  const navigate          = useNavigate()
  const [search, setSearch]     = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header className="bg-gray-900 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500 flex-shrink-0">
          Shop<span className="text-white">Zone</span>
        </Link>

        {/* Search Bar — hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full px-4 py-2 rounded-l-lg text-sm outline-none text-gray-900"
          />
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 rounded-r-lg text-white transition-colors">
            <FiSearch size={18} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hidden md:block max-w-[80px] truncate">{user.name}</span>
                <FiChevronDown size={14} />
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <p className="px-4 py-2 text-xs text-gray-500 border-b">{user.email}</p>
                  <Link to="/profile"  onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"><FiUser size={14} />Profile</Link>
                  <Link to="/orders"   onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"><FiPackage size={14} />My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin"  onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-orange-600 font-medium"><FiSettings size={14} />Admin Panel</Link>
                  )}
                  <hr className="my-1" />
                  <button onClick={() => { logout(); setDropdown(false) }} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
                    <FiLogOut size={14} />Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
              <FiUser size={15} />
              <span className="hidden sm:block">Sign In</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
          {['Electronics', 'Computers', 'Footwear', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Accessories'].map(cat => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="text-gray-300 hover:text-white text-xs py-2 whitespace-nowrap transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile search + menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-3">
          <form onSubmit={handleSearch} className="flex mt-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full px-3 py-2 rounded-l-lg text-sm text-gray-900 outline-none" />
            <button type="submit" className="bg-orange-500 px-3 rounded-r-lg text-white"><FiSearch size={16} /></button>
          </form>
          <div className="flex flex-wrap gap-2">
            {['Electronics', 'Computers', 'Footwear', 'Clothing', 'Sports', 'Books'].map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setMenuOpen(false)}
                className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
