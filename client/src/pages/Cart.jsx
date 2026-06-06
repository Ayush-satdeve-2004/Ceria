import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { cart, loading, updateCartQty, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = async (productId, quantity, type) => {
    const newQty = type === 'inc' ? quantity + 1 : quantity - 1;
    if (newQty < 1) {
      // Remove item if qty is less than 1
      handleRemove(productId);
      return;
    }
    const res = await updateCartQty(productId, newQty);
    if (!res.success) {
      toast.error(res.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    const res = await removeFromCart(productId);
    if (res.success) {
      toast.success('Removed item from cart');
    } else {
      toast.error(res.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }

    try {
      // Form order payload
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        affiliateLink: item.product.affiliateLink,
        sourcePlatform: item.product.sourcePlatform
      }));

      const totalAmount = getCartTotal();

      // Submit to backend
      const res = await axios.post('/api/orders', {
        items: orderItems,
        totalAmount
      });

      if (res.data.success) {
        toast.success('Redirection logs recorded successfully! Connecting to platforms...');
        
        // Multi-tab launcher: Open each merchant's link in a separate tab
        orderItems.forEach(item => {
          window.open(item.affiliateLink, '_blank');
        });

        // Clear cart globally on successful checkout redirection
        await clearCart();

        // Redirect to a clean checkout success page
        navigate('/checkout-success', { state: { order: res.data.order } });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate affiliate checkouts');
    }
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="skeleton-shimmer h-12 w-1/3 rounded-xl mx-auto mb-6"></div>
        <div className="space-y-4">
          <div className="skeleton-shimmer h-24 rounded-2xl"></div>
          <div className="skeleton-shimmer h-24 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex items-center space-x-3 mb-10">
        <ShoppingCart className="w-8 h-8 text-secondary" />
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Your Shopping Cart
        </h1>
      </div>

      {cart?.items?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const prod = item.product;
              if (!prod) return null;

              return (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all"
                >
                  {/* Thumbnail */}
                  <Link to={`/products/${prod._id}`} className="w-24 h-18 bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                    <img src={prod.images?.[0]} className="w-full h-full object-cover" alt="" />
                  </Link>

                  {/* Info details */}
                  <div className="flex-grow space-y-1 self-start sm:self-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest px-2 py-0.5 rounded bg-secondary/10">
                        {prod.sourcePlatform}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{prod.brand}</span>
                    </div>

                    <Link to={`/products/${prod._id}`} className="block hover:text-secondary transition-colors">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>
                    
                    <span className="font-black text-slate-900 dark:text-white text-base block">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Quantity control / Delete */}
                  <div className="flex items-center space-x-4 ml-auto">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/60 p-1">
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity, 'dec')}
                        className="p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-750 text-slate-500 active-press"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-850 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity, 'inc')}
                        className="p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-750 text-slate-500 active-press"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(prod._id)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/15 transition-all duration-300 active-press"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Checkout Summary Pane (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Order Summary
              </h3>

              {/* Price list */}
              <div className="space-y-3 font-bold text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Selected Products</span>
                  <span>{getCartCount()} items</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Merchant Count</span>
                  <span>
                    {new Set(cart.items.map(item => item.product?.sourcePlatform)).size} platforms
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Redirection Fees</span>
                  <span className="text-emerald-500">FREE</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex justify-between text-base">
                  <span className="text-slate-800 dark:text-white">Estimated Total</span>
                  <span className="text-xl font-black text-slate-950 dark:text-white">
                    ₹{getCartTotal().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Affiliate info pitch */}
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/15 text-[11px] font-semibold leading-relaxed text-amber-600 dark:text-amber-400">
                <span className="font-extrabold block mb-1">🔗 MULTI-TAB PORTAL CHECKS:</span>
                Clicking the checkout button below will save this order history in CERIA, and fire open each merchant's purchase link in a new browser tab for you to finish checkouts.
              </div>

              {/* Checkout Launcher */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl bg-secondary hover:bg-secondary-hover text-white font-extrabold active-press text-center text-sm tracking-wider uppercase shadow-xl shadow-secondary/15 flex items-center justify-center space-x-2"
              >
                <span>Order All (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/products"
                className="block text-center text-xs font-bold text-slate-400 hover:text-secondary hover:underline uppercase tracking-widest pt-2"
              >
                Continue Browsing Deals
              </Link>

            </div>
          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm max-w-xl mx-auto">
          <ShoppingCart className="w-16 h-16 text-slate-350 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm font-semibold text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            Discover verified discount products from Amazon, Flipkart, Myntra, and more to add them to your cart.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center space-x-2 bg-secondary hover:bg-secondary-hover text-white px-6 py-3 rounded-xl font-bold active-press text-sm"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default Cart;
