import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { optimizeImageUrl } from '../utils/imageOptimizer';

// Platform badges styling mapper (hoisted to module scope to avoid re-creation on render)
const getPlatformBadge = (platform) => {
  switch (platform) {
    case 'Amazon':
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    case 'Flipkart':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'Meesho':
      return 'bg-pink-500/10 text-pink-500 border border-pink-500/20';
    case 'Myntra':
      return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    case 'Ajio':
      return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
    default:
      return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
  }
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const isSaved = isInWishlist(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      const res = await removeFromWishlist(product._id);
      if (res?.redirect) {
        toast.info('Please log in to manage your wishlist');
        navigate('/login');
      } else if (res?.success) {
        toast.success('Removed from wishlist');
      }
    } else {
      const res = await addToWishlist(product._id);
      if (res?.redirect) {
        toast.info('Please log in to manage your wishlist');
        navigate('/login');
      } else if (res?.success) {
        toast.success('Added to wishlist');
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await addToCart(product._id, 1);
    if (res?.redirect) {
      toast.info('Please log in to add items to your cart');
      navigate('/login');
    } else if (res?.success) {
      toast.success('Added to cart successfully!');
    } else {
      toast.error(res?.message || 'Failed to add item');
    }
  };

  // Determine dynamic but stable AI Match Score
  const aiScore = Math.min(99, Math.max(85, Math.round(85 + (product.rating ? product.rating * 2.8 : 12))));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#140B2D]/95 rounded-[20px] overflow-hidden border border-slate-100 dark:border-[rgba(192,132,252,0.15)] shadow-sm hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(139,61,255,0.3)] hover:-translate-y-1.5 group transition-all duration-300 flex flex-col h-full relative"
    >
      {/* AI Recommendation Score & Platform Badge */}
      <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10 items-start">
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-indigo-950/90 text-[#C084FC] border border-[#8B3DFF]/30 backdrop-blur-md">
          <Star className="w-2.5 h-2.5 text-[#C084FC] fill-[#C084FC]/40" />
          <span>AI Match {aiScore}%</span>
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${getPlatformBadge(product.sourcePlatform)}`}>
          {product.sourcePlatform}
        </span>
      </div>

      {/* Wishlist Trigger */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-[#0A0617]/80 backdrop-blur-sm border border-slate-100 dark:border-[#8B3DFF]/20 text-slate-500 dark:text-[#E5E7EB] hover:text-red-500 transition-colors z-10 shadow-sm"
      >
        <Heart className={`w-4 h-4 transition-all duration-300 ${isSaved ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
      </button>

      {/* Product Image Gallery Wrapper */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-video bg-slate-50 dark:bg-slate-950">
        <img
          src={optimizeImageUrl(product.images?.[0], 400) || 'https://images.unsplash.com/photo-1549462184-b09ad0a4af67?w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Video Support indicator */}
        {product.video && (
          <div className="absolute bottom-2 left-2 bg-[#8B3DFF]/80 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded border border-[#C084FC]/30 flex items-center space-x-1 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>Video Demo</span>
          </div>
        )}
        {product.stockStatus === 'Out of Stock' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-widest uppercase px-4 py-1.5 border border-white/40 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-slate-450 dark:text-slate-400 font-semibold tracking-wider uppercase">
            {product.brand} • {product.category}
          </span>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-xs font-bold">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>

        <Link to={`/products/${product._id}`} className="block flex-grow group-hover:text-secondary transition-colors mb-3">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug text-sm md:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Price & Actions footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#c084fc]/15 mt-auto">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white text-lg">
                ${product.price.toLocaleString('en-US')}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ${Math.round(product.price * 1.25).toLocaleString('en-US')}
              </span>
            </div>
            <span className="text-[10px] text-amber-500 font-black block uppercase tracking-wider">
              Save 20%
            </span>
          </div>

          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'Out of Stock'}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A0617] text-slate-650 dark:text-[#E5E7EB] hover:bg-[#8B3DFF] hover:text-white dark:hover:bg-[#8B3DFF] dark:hover:text-white border border-slate-200/60 dark:border-[#c084fc]/15 active-press transition-all duration-300"
              title="Add to Cart"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl btn-primary-gradient text-white active-press transition-all duration-300 flex items-center justify-center border border-transparent"
              title="View on Store"
            >
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
