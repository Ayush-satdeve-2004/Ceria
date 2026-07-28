import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, ShoppingCart, Heart, Sun, Moon,
  User, LayoutDashboard, History, LogOut, ArrowRight, ChevronDown, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const { user, logoutUser, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const suggestionsRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Close drop-downs on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await axios.get(`/api/products/suggestions?q=${searchQuery}`);
          if (res.data.success) {
            setSuggestions(res.data.suggestions);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchQuery('');
    setSuggestions([]);
    setUserDropdownOpen(false);
    setCategoryMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}`);
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/40 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B3DFF] to-[#C084FC] flex items-center justify-center shadow-lg shadow-[#8B3DFF]/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#8B3DFF] to-[#C084FC] bg-clip-text text-transparent tracking-wider leading-none">
                  CERIA
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
                  Affiliate
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#8B3DFF] to-[#C084FC] text-white text-[9px] font-black uppercase tracking-wider hidden sm:inline-block shadow-[0_0_10px_rgba(139,61,255,0.3)]">
                Agent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-secondary' : 'text-slate-600 dark:text-[#E5E7EB] hover:text-secondary'}`}>
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className={`flex items-center space-x-1 transition-colors ${categoryMenuOpen || location.search.includes('category=') ? 'text-secondary' : 'text-slate-600 dark:text-[#E5E7EB] hover:text-secondary'}`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-56 bg-[#140B2D] border border-[#c084fc]/25 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] overflow-hidden z-50 py-2 backdrop-blur-md"
                  >
                    {['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Furniture', 'Mobiles', 'Accessories', 'Home Appliances'].map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-[#8B3DFF]/25 text-xs font-bold text-[#E5E7EB] hover:text-white transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Deals link */}
            <Link to="/products?featured=true" className={`transition-colors ${location.search.includes('featured=') ? 'text-secondary' : 'text-slate-600 dark:text-[#E5E7EB] hover:text-secondary'}`}>
              Deals
            </Link>

            {/* Orders link */}
            {user && (
              <Link to="/orders" className={`transition-colors ${location.pathname === '/orders' ? 'text-secondary' : 'text-slate-600 dark:text-[#E5E7EB] hover:text-secondary'}`}>
                Orders
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-grow max-w-md mx-6 relative" ref={suggestionsRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                aria-label="Search products by brand, name, or tags"
                placeholder="Search by brand, name, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-secondary focus:bg-white dark:focus:bg-slate-900 rounded-full py-2 pl-4 pr-10 text-sm outline-none transition-all duration-300 text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-3 top-2.5 text-slate-400 hover:text-secondary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Auto Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSuggestionClick(item.name)}
                      className="w-full px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-0 border-slate-50 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium line-clamp-1">{item.name}</span>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-secondary px-2 py-0.5 rounded bg-secondary/15">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle color theme"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 relative transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 relative transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User account options"
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1.5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <User className="w-5 h-5" />
                {user && <span className="text-xs font-bold hidden md:inline-block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 py-1.5"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed In As</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link to="/admin/dashboard" className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-2.5 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-secondary" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link to="/profile" className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-2.5 transition-colors">
                          <User className="w-4 h-4 text-emerald-500" />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/orders" className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-2.5 transition-colors">
                          <History className="w-4 h-4 text-amber-500" />
                          <span>Order History</span>
                        </Link>
                        <button
                          type="button"
                          onClick={logoutUser}
                          className="w-full px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-left text-sm font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2.5 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1.5"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-3 space-y-2">
                        <Link to="/login" className="w-full py-2 bg-secondary text-white font-bold text-center block rounded-xl text-sm active-press hover:bg-secondary-hover transition-colors">
                          Login
                        </Link>
                        <Link to="/register" className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-center text-slate-700 dark:text-slate-200 block rounded-xl text-sm transition-colors flex items-center justify-center space-x-1.5">
                          <span>Create Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Icon */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Search Input for Mobile */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  aria-label="Search products"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-full py-2 pl-4 pr-10 text-sm outline-none text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-secondary"
                />
                <button 
                  type="submit" 
                  aria-label="Submit search"
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-secondary"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="px-4 pt-2 pb-6 space-y-3 font-semibold text-base flex flex-col">
              <Link to="/" className="py-2 text-slate-700 dark:text-slate-200 hover:text-secondary transition-colors">Home</Link>
              
              {/* Mobile Categories */}
              <div className="py-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Categories</span>
                <div className="grid grid-cols-2 gap-2 mt-2 pl-2">
                  {['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Furniture', 'Mobiles', 'Accessories'].map(cat => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className="text-xs py-1.5 text-slate-600 dark:text-slate-350 hover:text-secondary transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>


              <Link to="/products?featured=true" className="py-2 text-slate-700 dark:text-slate-200 hover:text-secondary transition-colors">Deals</Link>
              {user && (
                <Link to="/orders" className="py-2 text-slate-700 dark:text-slate-200 hover:text-secondary transition-colors">Orders</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
