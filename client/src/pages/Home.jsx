import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Flame, Percent,
  Cpu, Shirt, Footprints, Sparkle, Armchair, Smartphone, Briefcase, Refrigerator,
  ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { optimizeImageUrl } from '../utils/imageOptimizer';

// Categories department list hoisted outside component scope to avoid recreation on render
const categories = [
  { name: 'Electronics', icon: Cpu, bg: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white' },
  { name: 'Fashion', icon: Shirt, bg: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white' },
  { name: 'Shoes', icon: Footprints, bg: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' },
  { name: 'Beauty', icon: Sparkle, bg: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white' },
  { name: 'Furniture', icon: Armchair, bg: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' },
  { name: 'Mobiles', icon: Smartphone, bg: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white' },
  { name: 'Accessories', icon: Briefcase, bg: 'bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white' },
  { name: 'Home Appliances', icon: Refrigerator, bg: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' },
];

const Home = () => {
  const [featuredData, setFeaturedData] = useState(() => {
    const cachedFeatured = sessionStorage.getItem('ceria_cached_featured:v1');
    if (cachedFeatured) {
      try {
        return JSON.parse(cachedFeatured);
      } catch (e) {
        // ignore cache parse errors
      }
    }
    return { featured: [], latest: [], trending: [] };
  });

  const [loading, setLoading] = useState(() => {
    const cachedBanners = sessionStorage.getItem('ceria_cached_banners:v1');
    const cachedFeatured = sessionStorage.getItem('ceria_cached_featured:v1');
    return !(cachedBanners && cachedFeatured);
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroSlides, setHeroSlides] = useState(() => {
    const cachedBanners = sessionStorage.getItem('ceria_cached_banners:v1');
    if (cachedBanners) {
      try {
        return JSON.parse(cachedBanners);
      } catch (e) {
        // ignore cache parse errors
      }
    }
    return [
      {
        title: "Discover Handpicked Premium Tech Deals",
        subtitle: "Curated from top platforms like Amazon & Flipkart at unbeatable prices.",
        badge: "EXCLUSIVE ELECTRONICS SALE",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80",
        cta: "Explore Tech",
        link: "/products?category=Electronics"
      },
      {
        title: "Elevate Your Living Spaces",
        subtitle: "Explore premium velvet accent lounge chairs, modern couches, and rustic study tables.",
        badge: "MID-CENTURY FURNITURE COLLECTION",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&auto=format&fit=crop&q=80",
        cta: "View Furniture",
        link: "/products?category=Furniture"
      },
      {
        title: "Unmatched Premium Footwear Style",
        subtitle: "From elite athletic training sneakers to daily casual runners.",
        badge: "50% AFFILIATE CASHBACK BONANZA",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&auto=format&fit=crop&q=80",
        cta: "Shop Footwear",
        link: "/products?category=Shoes"
      }
    ];
  });

  // Fetch product collections with stale-while-revalidate caching
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const cachedBanners = sessionStorage.getItem('ceria_cached_banners:v1');
        const cachedFeatured = sessionStorage.getItem('ceria_cached_featured:v1');
        
        let customSlides = [];
        try {
          const bannerRes = await axios.get('/api/banners');
          if (bannerRes.data.success && bannerRes.data.banners.length > 0) {
            customSlides = bannerRes.data.banners;
            sessionStorage.setItem('ceria_cached_banners:v1', JSON.stringify(customSlides));
          }
        } catch (bannerErr) {
          console.error('Error fetching custom banners', bannerErr);
        }

        const res = await axios.get('/api/products/featured');
        if (res.data.success) {
          setFeaturedData(res.data);
          sessionStorage.setItem('ceria_cached_featured:v1', JSON.stringify(res.data));
          
          if (customSlides.length > 0) {
            setHeroSlides(customSlides);
            setCurrentSlide(0);
          } else if (res.data.heroProducts && res.data.heroProducts.length > 0) {
            const dynamicSlides = res.data.heroProducts.map(prod => ({
              title: prod.heroTitle || prod.name,
              subtitle: prod.heroSubtitle || prod.description,
              badge: prod.heroBadge || `${prod.category.toUpperCase()} SPECIAL DEAL`,
              image: prod.heroImage || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
              cta: prod.heroCta || 'Explore Deal',
              link: `/products/${prod._id}`
            }));
            setHeroSlides(dynamicSlides);
            setCurrentSlide(0);
          }
        }
      } catch (err) {
        console.error('Error fetching homepage products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Auto Slider Timer
  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(sliderTimer);
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Futuristic Premium Banner Slider */}
      <section className="relative min-h-[550px] w-full overflow-hidden bg-[#0A0617] rounded-b-[40px] flex items-center border-b border-[#c084fc]/15 py-12 lg:py-20">
        
        {/* Background Image of Current Slide (Faded and Blurry) */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={optimizeImageUrl(heroSlides[currentSlide]?.image, 800)}
              alt="Banner background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover filter blur-[2px]"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0617] via-[#0A0617]/70 to-[#0A0617]"></div>
        </div>

        {/* Glowing Background Radial Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-[#8B3DFF]/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#C084FC]/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Futuristic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,61,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,61,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Slide Text Details */}
            <div className="lg:col-span-4 space-y-6 text-center lg:text-left min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8B3DFF]/15 to-[#C084FC]/15 border border-[#8B3DFF]/30 text-[10px] font-black tracking-widest text-[#C084FC] uppercase">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>{heroSlides[currentSlide]?.badge || 'Special Collection'}</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white uppercase break-words">
                    {heroSlides[currentSlide]?.title}
                  </h1>
                  
                  <p className="text-[#B8B8C7] font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {heroSlides[currentSlide]?.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                    <Link
                      to={heroSlides[currentSlide]?.link || '/products'}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl text-center btn-primary-gradient font-bold active-press text-sm flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <span>{heroSlides[currentSlide]?.cta || 'Explore Deal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Skewed Glassmock Slide Image Showcase */}
            <div className="lg:col-span-8 relative flex justify-center min-h-[350px] items-center w-full">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#8B3DFF]/10 to-[#C084FC]/10 rounded-[30px] blur-xl opacity-75 pointer-events-none"></div>

              {/* Glass Frame for Slide Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-none bg-[#140B2D]/85 border border-[#c084fc]/25 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden aspect-[16/9]"
                >
                  {/* Glass highlights */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                  
                  <img
                    src={optimizeImageUrl(heroSlides[currentSlide]?.image, 1200)}
                    alt={heroSlides[currentSlide]?.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Manual Slides Arrows */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#140B2D]/60 hover:bg-[#8B3DFF] text-white border border-[#c084fc]/20 backdrop-blur-sm z-20 hover:shadow-[0_0_15px_rgba(139,61,255,0.4)] active-press transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#140B2D]/60 hover:bg-[#8B3DFF] text-white border border-[#c084fc]/20 backdrop-blur-sm z-20 hover:shadow-[0_0_15px_rgba(139,61,255,0.4)] active-press transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.title || idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-[#8B3DFF] shadow-[0_0_10px_#C084FC]' : 'w-2 bg-[#B8B8C7]/40'}`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. Categories department row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-secondary font-black text-xs tracking-widest uppercase block mb-1">Browse Departments</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center bg-white/80 dark:bg-[#140B2D]/90 p-5 rounded-2xl border border-slate-100 dark:border-[#c084fc]/15 shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(139,61,255,0.25)] hover:border-[#8B3DFF] dark:hover:border-[#C084FC]/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-4 rounded-full bg-indigo-950/50 text-[#C084FC] border border-[#8B3DFF]/20 mb-3.5 transition-all duration-500 group-hover:scale-115 group-hover:bg-gradient-to-tr group-hover:from-[#8B3DFF] group-hover:to-[#C084FC] group-hover:text-white shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-[#E5E7EB] group-hover:text-[#C084FC] transition-colors text-center truncate w-full uppercase tracking-wider">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-slate-100 dark:border-[#c084fc]/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-secondary">
              <Sparkles className="w-4 h-4 text-secondary fill-secondary" />
              <span className="font-extrabold text-xs tracking-widest uppercase block">Handpicked Deals</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link to="/products" className="text-xs font-extrabold text-secondary hover:underline uppercase tracking-widest flex items-center space-x-1 mt-3 sm:mt-0">
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : featuredData.featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredData.featured.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm font-semibold text-slate-400">No featured products available at this moment.</p>
        )}
      </section>

      {/* 4. Promotional banner - Affiliate Pitch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#140B2D]/85 rounded-3xl p-8 md:p-12 border border-[#c084fc]/20 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Glowing particle background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B3DFF]/15 rounded-full blur-3xl z-0"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C084FC]/10 rounded-full blur-3xl z-0"></div>
          
          <div className="space-y-5 relative z-10 max-w-2xl text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-950 text-[#C084FC] text-[10px] font-black tracking-widest uppercase border border-[#8B3DFF]/25">
              Why CERIA?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase bg-gradient-to-r from-white to-[#E5E7EB] bg-clip-text text-transparent">
              Compare prices across top platforms in one unified checkout
            </h2>
            <p className="text-sm font-medium text-[#B8B8C7] leading-relaxed">
              CERIA lists matching top-rated products from multiple portals (Amazon, Flipkart, Meesho etc.). You can assemble your favorite choices and checkout together — our smart multi-tab launcher fires individual stores for final checkouts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-350">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Affiliate Portal Connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero extra fees or commissions for buyers</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time view count tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Dark & Light mode visual customization</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/products"
              className="bg-white hover:bg-slate-100 text-slate-950 px-8 py-4 rounded-xl font-bold active-press transition-all duration-300 flex items-center space-x-2 text-sm shadow-xl hover:shadow-[#8B3DFF]/20"
            >
              <span>Explore Direct Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending & Latest Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Trending items column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#c084fc]/15 pb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Trending Now</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Most Visited</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => <div key={n} className="skeleton-shimmer h-24 w-full rounded-2xl"></div>)}
            </div>
          ) : featuredData.trending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredData.trending.slice(0, 4).map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No trending products matching visits.</p>
          )}
        </div>

        {/* Latest Releases column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#c084fc]/15 pb-3">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Latest Arrivals</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Shelves</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => <div key={n} className="skeleton-shimmer h-24 w-full rounded-2xl"></div>)}
            </div>
          ) : featuredData.latest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredData.latest.slice(0, 4).map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No new arrivals seeded.</p>
          )}
        </div>

      </section>

    </div>
  );
};

export default Home;
