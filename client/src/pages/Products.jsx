import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { toast } from 'react-toastify';

const categories = ['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Furniture', 'Mobiles', 'Accessories', 'Home Appliances'];
const brands = ['Sony', 'Nike', 'Samsung', 'Urban Ladder', 'Zara', 'The Derma Co', 'Wildhorn', 'Philips'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1, limit: 12 });

  // Filtering states (only local inputs that aren't driven by URL search params immediately)
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('createdAt');

  // Derived state from URL search params (Single Source of Truth)
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const searchVal = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchVal) params.append('search', searchVal);
        if (category) params.append('category', category);
        if (brand) params.append('brand', brand);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (minRating) params.append('minRating', minRating);
        if (sort) params.append('sort', sort);
        params.append('page', page.toString());
        params.append('limit', '12');

        const res = await axios.get(`/api/products?${params.toString()}`);
        if (active && res.data.success) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      active = false;
    };
  }, [searchVal, category, brand, minPrice, maxPrice, minRating, sort, page]);

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('createdAt');
    setSearchParams({}); // Clear all query params which resets page, category, brand, search
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('brand', value);
    } else {
      newParams.delete('brand');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          {category ? `${category} Collection` : 'All Products Catalog'}
        </h1>
        {searchVal && (
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Search results for: <span className="text-secondary">"{searchVal}"</span> ({pagination.total} items found)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Sidebar Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-800 dark:text-white" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-white">Filters</h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-400 hover:text-secondary transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label htmlFor="category-select" className="text-xs font-black text-slate-400 uppercase tracking-widest block">Category</label>
              <select
                id="category-select"
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2.5">
              <label htmlFor="brand-select" className="text-xs font-black text-slate-400 uppercase tracking-widest block">Brand</label>
              <select
                id="brand-select"
                value={brand}
                onChange={handleBrandChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="">All Brands</option>
                {brands.map((brnd) => (
                  <option key={brnd} value={brnd}>{brnd}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter Form */}
            <form onSubmit={handleApplyPriceFilter} className="space-y-2.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  aria-label="Minimum Price"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                />
                <input
                  type="number"
                  aria-label="Maximum Price"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-hover text-white py-2 rounded-xl text-xs font-bold transition-all duration-300"
              >
                Apply Price
              </button>
            </form>

            {/* Rating Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Minimum Rating</label>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinRating(minRating === val.toString() ? '' : val.toString())}
                    aria-label={`Filter by minimum rating ${val} stars`}
                    className={`flex-grow py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center space-x-0.5 active-press transition-all duration-300 ${
                      minRating === val.toString()
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-650 dark:text-slate-350'
                    }`}
                  >
                    <span>{val}</span>
                    <Star className={`w-3 h-3 ${minRating === val.toString() ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Product Listing */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Sorting panel */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3 sm:space-y-0">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Showing {products.length} of {pagination.total} Products
            </span>

            <div className="flex items-center space-x-3 text-sm font-semibold">
              <span className="text-slate-500 dark:text-slate-450">Sort By:</span>
              <select
                aria-label="Sort products by"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold outline-none"
              >
                <option value="createdAt">Latest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80">
              <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">No Products Found</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching your active filters. Try adjusting price bounds or exploring different departments.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 bg-secondary text-white font-bold px-5 py-2.5 rounded-xl text-xs active-press"
              >
                Clear Active Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                aria-label="Previous Page"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 active-press transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handlePageChange(n)}
                  aria-label={`Go to page ${n}`}
                  className={`w-9.5 h-9.5 font-bold rounded-xl text-xs flex items-center justify-center transition-all ${
                    page === n
                      ? 'bg-secondary text-white shadow-md'
                      : 'border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 active-press'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(page + 1, pagination.pages))}
                disabled={page === pagination.pages}
                aria-label="Next Page"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 active-press transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Products;
