import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, ShoppingCart, ExternalLink, Share2, Heart,
  Tv, Image as ImageIcon, Send, MessageSquare, ShieldCheck, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { optimizeImageUrl } from '../utils/imageOptimizer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Media switcher tabs
  const [activeMediaTab, setActiveMediaTab] = useState('images'); // 'images' or 'video'
  const [selectedImg, setSelectedImg] = useState('');

  // Reviews states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Recommendations and Recently Viewed
  const [recommendations, setRecommendations] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { token, user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isSaved = product ? isInWishlist(product._id) : false;

  const trackRecentlyViewed = useCallback((currentProd) => {
    const list = JSON.parse(localStorage.getItem('recently_viewed:v1')) || [];
    // Filter out current product if already exists
    const filtered = list.filter(item => item._id !== currentProd._id);
    // Add current product to the beginning
    const updated = [
      {
        _id: currentProd._id,
        name: currentProd.name,
        price: currentProd.price,
        images: currentProd.images,
        brand: currentProd.brand,
        category: currentProd.category,
        rating: currentProd.rating,
        sourcePlatform: currentProd.sourcePlatform,
        affiliateLink: currentProd.affiliateLink,
        stockStatus: currentProd.stockStatus
      },
      ...filtered
    ].slice(0, 4); // Limit to top 4 recently viewed
    
    localStorage.setItem('recently_viewed:v1', JSON.stringify(updated));
    setRecentlyViewed(updated.filter(item => item._id !== currentProd._id));
  }, []);

  const fetchRecommendations = useCallback(async (categoryName, currentId) => {
    try {
      const res = await axios.get(`/api/products?category=${categoryName}&limit=5`);
      if (res.data.success) {
        // Exclude current product
        const filtered = res.data.products.filter(p => p._id !== currentId).slice(0, 4);
        setRecommendations(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
        setSelectedImg(res.data.product.images?.[0] || '');
        
        // Track recently viewed in localStorage
        trackRecentlyViewed(res.data.product);
        
        // Fetch recommendations of the same category
        fetchRecommendations(res.data.product.category, res.data.product._id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [id, trackRecentlyViewed, fetchRecommendations]);

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProductDetails]);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product on CERIA: ${product.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback: Copy to Clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard! Share it with your friends. 🔗');
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(product._id, 1);
    if (res?.redirect) {
      toast.info('Please log in to manage your cart');
      navigate('/login');
    } else if (res?.success) {
      toast.success('Added to cart successfully!');
    }
  };

  const handleWishlistToggle = async () => {
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

  const handleBuyNow = async () => {
    if (!token || !user) {
      toast.info('Please log in to proceed to checkout');
      navigate('/login');
      return;
    }

    // Direct multi-product style checkout for this single item
    try {
      const res = await axios.post('/api/orders', {
        items: [{
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          affiliateLink: product.affiliateLink,
          sourcePlatform: product.sourcePlatform
        }],
        totalAmount: product.price
      });

      if (res.data.success) {
        toast.success('Order recorded! Launching affiliate shop tab...');
        // Open affiliate link in new tab
        window.open(product.affiliateLink, '_blank');
        // Redirect user to checkout completion confirmation
        navigate('/checkout-success', { state: { order: res.data.order } });
      }
    } catch (err) {
      toast.error('Failed to register order');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.warning('Please enter a review message');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await axios.post(`/api/products/${product._id}/reviews`, {
        rating: ratingInput,
        comment: commentInput
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setCommentInput('');
        fetchProductDetails(); // Re-fetch to update averages and reviews list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="skeleton-shimmer h-12 w-1/3 rounded-xl mx-auto"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10">
          <div className="skeleton-shimmer h-96 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="skeleton-shimmer h-6 w-1/4 rounded-md"></div>
            <div className="skeleton-shimmer h-10 w-3/4 rounded-md"></div>
            <div className="skeleton-shimmer h-8 w-1/3 rounded-md"></div>
            <div className="skeleton-shimmer h-24 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold">Product not found.</h2>
        <Link to="/products" className="text-secondary hover:underline mt-4 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb back */}
      <div>
        <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-secondary uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Media Center (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Display Screen */}
            <div className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden mb-4 relative">
              {activeMediaTab === 'images' ? (
                <img
                  src={optimizeImageUrl(selectedImg, 800)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 bg-slate-950">
                  <video controls className="w-full h-full rounded-xl" autoPlay muted>
                    <source src={product.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Selector bar */}
            <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800/80 pt-3.5">
              
              {/* Media Mode switchers */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveMediaTab('images')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase flex items-center space-x-1.5 transition-all ${
                    activeMediaTab === 'images'
                      ? 'bg-secondary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Images</span>
                </button>
                {product.video && (
                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase flex items-center space-x-1.5 transition-all ${
                      activeMediaTab === 'video'
                        ? 'bg-secondary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Video Demo</span>
                  </button>
                )}
              </div>

              {/* Small images list if images tab active */}
              {activeMediaTab === 'images' && (
                <div className="flex space-x-1.5 overflow-x-auto max-w-[200px]">
                  {product.images?.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImg(img)}
                      className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImg === img ? 'border-secondary scale-105' : 'border-transparent'
                      }`}
                    >
                      <img src={optimizeImageUrl(img, 150)} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Category / Brand Row */}
            <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-wider text-slate-400">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                product.stockStatus === 'In Stock'
                  ? 'bg-emerald-500/10 text-emerald-550 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {product.stockStatus}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings overview */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="text-sm font-black">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">•</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {product.numReviews} Global Reviews
              </span>
              <span className="text-xs text-slate-400 font-semibold">•</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {product.viewsCount} Product Views
              </span>
            </div>

            {/* Big price and Platform indicator */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Special Affiliate Deal</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Source Store</span>
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-secondary/10 border border-secondary/20 text-secondary tracking-widest">
                  {product.sourcePlatform}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Details</h3>
              <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-350">
                {product.description}
              </p>
            </div>

            {(product.showColorOptions && product.colorOptions?.length > 0) && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Colour Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colorOptions.map((option, idx) => (
                    <span key={`${option}-${idx}`} className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">{option}</span>
                  ))}
                </div>
              </div>
            )}

            {(product.showDesignOptions && product.designOptions?.length > 0) && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Design Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.designOptions.map((option, idx) => (
                    <span key={`${option}-${idx}`} className="px-3 py-1 rounded-full text-xs font-semibold border border-secondary/20 bg-secondary/10 text-secondary">{option}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={handleBuyNow}
              disabled={product.stockStatus === 'Out of Stock'}
              className="flex-grow sm:flex-grow-[2] py-4 rounded-2xl bg-secondary hover:bg-secondary-hover text-white font-extrabold active-press text-center text-sm tracking-wider uppercase shadow-xl shadow-secondary/15 flex items-center justify-center space-x-2.5 disabled:opacity-50"
            >
              <span>View Deal & Buy Now</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'Out of Stock'}
              className="flex-grow py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 text-slate-700 dark:text-slate-200 font-extrabold active-press text-center text-sm tracking-wider uppercase flex items-center justify-center space-x-2.5 border border-slate-200 dark:border-slate-700/80 disabled:opacity-50"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span>Add To Cart</span>
            </button>

            <div className="flex gap-2 justify-between">
              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-2xl border active-press transition-colors ${
                  isSaved
                    ? 'bg-red-500/10 border-red-500/35 text-red-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-red-500'
                }`}
                title="Save for Later"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-secondary active-press"
                title="Share Product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: Review Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Customer Reviews</h3>
            <p className="text-xs font-semibold text-slate-400">Share your experiences and ratings with global buyers.</p>
          </div>

          <div className="flex items-center space-x-5">
            <span className="text-5xl font-black text-slate-900 dark:text-white">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
            <div>
              <div className="flex items-center text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4.5 h-4.5 ${s <= Math.round(product.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">
                Average Customer Score
              </span>
            </div>
          </div>

          {/* Form to submit review */}
          {token && user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4 border-t border-slate-105 dark:border-slate-800">
              <h4 className="font-extrabold text-sm uppercase text-slate-800 dark:text-slate-200">Add or Edit Your Review</h4>
              
              {/* Stars selection */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRatingInput(num)}
                      className="p-1 rounded text-amber-500 active-press"
                    >
                      <Star className={`w-5 h-5 ${num <= ratingInput ? 'fill-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text box */}
              <div className="space-y-1.5">
                <textarea
                  placeholder="Tell us what you liked or disliked about this product..."
                  rows={4}
                  required
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-secondary hover:bg-secondary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold active-press transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{submittingReview ? 'Submitting...' : 'Submit Feedback'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 dark:border-slate-800 text-center space-y-2">
              <MessageSquare className="w-5 h-5 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500">Want to write a review?</p>
              <Link to="/login" className="text-xs font-extrabold text-secondary hover:underline inline-block">
                Log In To Add Review
              </Link>
            </div>
          )}

        </div>

        {/* Right pane: Reviews list (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 overflow-y-auto max-h-[400px] pr-2">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{rev.name}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500' : 'text-slate-200 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">{rev.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No reviews yet for this product. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

      </section>

      {/* Product Recommendations */}
      {recommendations.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
            Product Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
            Recently Viewed
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
