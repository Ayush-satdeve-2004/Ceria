import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (productId) => {
    // 1. Add to Cart
    const cartRes = await addToCart(productId, 1);
    
    if (cartRes.success) {
      // 2. Remove from Wishlist
      await removeFromWishlist(productId);
      toast.success('Moved product to shopping cart!');
    } else {
      toast.error(cartRes.message || 'Failed to move to cart');
    }
  };

  const handleRemove = async (productId) => {
    const res = await removeFromWishlist(productId);
    if (res.success) {
      toast.success('Removed product from wishlist');
    } else {
      toast.error(res.message || 'Failed to remove product');
    }
  };

  if (loading && wishlist.products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="skeleton-shimmer h-12 w-1/3 rounded-xl mx-auto mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2].map(n => <div key={n} className="skeleton-shimmer h-64 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex items-center space-x-3 mb-10">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Your Saved Wishlist
        </h1>
      </div>

      {wishlist?.products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.products.map((prod) => {
            if (!prod) return null;

            return (
              <div
                key={prod._id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="aspect-video bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                  <img src={prod.images?.[0]} className="w-full h-full object-cover" alt="" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[9px] font-black uppercase tracking-wider">
                    {prod.sourcePlatform}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-grow space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prod.brand}</span>
                    <Link to={`/products/${prod._id}`} className="block hover:text-secondary transition-colors">
                      <h3 className="font-extrabold text-sm text-slate-850 dark:text-white line-clamp-1 leading-snug">
                        {prod.name}
                      </h3>
                    </Link>
                    <span className="font-black text-slate-900 dark:text-white text-base block">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                    <button
                      onClick={() => handleMoveToCart(prod._id)}
                      disabled={prod.stockStatus === 'Out of Stock'}
                      className="flex-grow py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold active-press flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move To Cart</span>
                    </button>

                    <button
                      onClick={() => handleRemove(prod._id)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 text-slate-400 border border-slate-200 dark:border-slate-700/80 active-press transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty wishlist */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm max-w-xl mx-auto">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-sm font-semibold text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            Browse our curated deals and tap the heart icon to save products for later shopping.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center space-x-2 bg-secondary hover:bg-secondary-hover text-white px-6 py-3 rounded-xl font-bold active-press text-sm"
          >
            <span>Explore Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default Wishlist;
