import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Save, FileImage, Tv, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

const categories = ['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Furniture', 'Mobiles', 'Accessories', 'Home Appliances'];

const AdminAddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form Fields State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState('In Stock');
  const [isFeatured, setIsFeatured] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [tags, setTags] = useState('');
  const [colorOptions, setColorOptions] = useState('');
  const [showColorOptions, setShowColorOptions] = useState(true);
  const [designOptions, setDesignOptions] = useState('');
  const [showDesignOptions, setShowDesignOptions] = useState(true);

  // Hero slide configuration fields
  const [showOnHero, setShowOnHero] = useState(false);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroCta, setHeroCta] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [existingHeroImage, setExistingHeroImage] = useState('');

  // Files State
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  // Operation State
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const MAX_PRODUCT_IMAGES = 5;

  // Load product details if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setFetching(true);
          const res = await axios.get(`/api/products/${id}`);
          if (res.data.success) {
            const prod = res.data.product;
            setName(prod.name || '');
            setBrand(prod.brand || '');
            setPrice(prod.price || '');
            setCategory(prod.category || 'Electronics');
            setDescription(prod.description || '');
            setStockStatus(prod.stockStatus || 'In Stock');
            setIsFeatured(prod.isFeatured || false);
            setAffiliateLink(prod.affiliateLink || '');
            setTags(prod.tags ? prod.tags.join(', ') : '');
            setColorOptions(prod.colorOptions ? prod.colorOptions.join(', ') : '');
            setShowColorOptions(prod.showColorOptions ?? true);
            setDesignOptions(prod.designOptions ? prod.designOptions.join(', ') : '');
            setShowDesignOptions(prod.showDesignOptions ?? true);
            setShowOnHero(prod.showOnHero || false);
            setHeroTitle(prod.heroTitle || '');
            setHeroSubtitle(prod.heroSubtitle || '');
            setHeroBadge(prod.heroBadge || '');
            setHeroCta(prod.heroCta || '');
            setExistingHeroImage(prod.heroImage || '');
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to load product details');
          navigate('/admin/products');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setImageFiles([]);
      return;
    }

    if (files.length > MAX_PRODUCT_IMAGES) {
      toast.warning(`Please select between 1 and ${MAX_PRODUCT_IMAGES} images only.`);
      e.target.value = '';
      return;
    }

    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !price || !description || !affiliateLink) {
      toast.warning('Please enter all the required product details');
      return;
    }

    if (imageFiles.length === 0 && !isEditMode) {
      toast.warning('Please upload at least 1 product image for a new listing.');
      return;
    }

    if (imageFiles.length > MAX_PRODUCT_IMAGES) {
      toast.warning(`Please select between 1 and ${MAX_PRODUCT_IMAGES} product images only.`);
      return;
    }

    try {
      setLoading(true);
      
      // Compile Multi-part FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('stockStatus', stockStatus);
      formData.append('isFeatured', isFeatured);
      formData.append('affiliateLink', affiliateLink);
      formData.append('sourcePlatform', 'Other');
      formData.append('tags', tags);
      formData.append('colorOptions', colorOptions);
      formData.append('showColorOptions', String(showColorOptions));
      formData.append('designOptions', designOptions);
      formData.append('showDesignOptions', String(showDesignOptions));
      formData.append('showOnHero', String(showOnHero));
      formData.append('heroTitle', heroTitle);
      formData.append('heroSubtitle', heroSubtitle);
      formData.append('heroBadge', heroBadge);
      formData.append('heroCta', heroCta);
      if (heroImageFile) {
        formData.append('heroImage', heroImageFile);
      }

      // Append multiple images
      if (imageFiles.length > 0) {
        Array.from(imageFiles).forEach(file => {
          formData.append('images', file);
        });
      }

      // Append single video
      if (videoFile) {
        formData.append('video', videoFile);
      }

      // Configure multi-part headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      let res;
      if (isEditMode) {
        res = await axios.put(`/api/products/${id}`, formData, config);
      } else {
        res = await axios.post('/api/products', formData, config);
      }

      if (res.data.success) {
        toast.success(res.data.message || 'Product saved successfully!');
        navigate('/admin/products');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
        <AdminSidebar />
        <div className="flex-grow p-10 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
      <AdminSidebar />

      <div className="flex-grow p-6 lg:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-200/50 dark:border-slate-800/80 pb-5">
          <Link
            to="/admin/products"
            className="p-2 bg-white dark:bg-slate-900 border rounded-xl hover:text-secondary active-press transition-colors text-slate-450 shrink-0"
            title="Back to inventory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight">
              {isEditMode ? 'Modify Product Details' : 'Add New Product'}
            </h1>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              {isEditMode ? 'Adjust catalog metadata, modify image files, or refresh external seller deals.' : 'Publish fresh product listings complete with tags, price points, and media attachments.'}
            </p>
          </div>
        </div>

        {/* Product details form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sony WH-1000XM4 Noise Cancelling..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              {/* Brand */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product Brand *</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Sony / Nike / Samsung..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19999"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Department Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Affiliate Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Affiliate URL *</label>
                <input
                  type="url"
                  required
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  placeholder="https://www.amazon.in/dp/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

            </div>

            {/* Colour & design options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 p-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Colour Options (comma separated)</label>
                <input
                  type="text"
                  value={colorOptions}
                  onChange={(e) => setColorOptions(e.target.value)}
                  placeholder="Red, Blue, Black"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
                <label className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-300">
                  <input type="checkbox" checked={showColorOptions} onChange={(e) => setShowColorOptions(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary" />
                  <span>Show colour choices on product page</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Design Options (comma separated)</label>
                <input
                  type="text"
                  value={designOptions}
                  onChange={(e) => setDesignOptions(e.target.value)}
                  placeholder="Classic, Premium, Limited"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
                <label className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-300">
                  <input type="checkbox" checked={showDesignOptions} onChange={(e) => setShowDesignOptions(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary" />
                  <span>Show design choices on product page</span>
                </label>
              </div>
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product Tags (Comma Separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="headphones, wireless, sony, music..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-855 dark:text-slate-100 outline-none focus:border-secondary"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Detailed Description *</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe features, noise cancellation properties, dimensions..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
              ></textarea>
            </div>

            {/* Toggle Status Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              
              {/* Stock status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Stock Status</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-850 dark:text-slate-100 outline-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center space-x-3 self-end h-[48px]">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-secondary border-slate-300 rounded focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-xs font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none">
                  Promote as Featured Product on Homepage
                </label>
              </div>

            </div>

            {/* Homepage Hero Slider Configuration */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hero-toggle"
                  checked={showOnHero}
                  onChange={(e) => setShowOnHero(e.target.checked)}
                  className="w-4 h-4 text-secondary border-slate-300 rounded focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="hero-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none uppercase tracking-wider">
                  Show product on main homepage hero banner slider
                </label>
              </div>

              {showOnHero && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  {/* Hero Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Slide Title (Optional)</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder={name || "Discover Handpicked Premium Tech Deals"}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                    <p className="text-[10px] text-slate-450">If left empty, the product name will be shown.</p>
                  </div>

                  {/* Hero Badge */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Slide Badge Text (Optional)</label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder={category ? `${category.toUpperCase()} COLLECTION` : "EXCLUSIVE ELECTRONICS SALE"}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                    <p className="text-[10px] text-slate-450">e.g. "50% AFFILIATE CASHBACK BONANZA" or "LIMITED EDITION".</p>
                  </div>

                  {/* Hero Subtitle */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Slide Subtitle (Optional)</label>
                    <textarea
                      rows={2}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder={description || "Explore premium velvet accent lounge chairs, modern couches..."}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                    ></textarea>
                    <p className="text-[10px] text-slate-450">If left empty, the product description will be shown.</p>
                  </div>

                  {/* Hero CTA Button */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Button text (Optional)</label>
                    <input
                      type="text"
                      value={heroCta}
                      onChange={(e) => setHeroCta(e.target.value)}
                      placeholder="Explore Deal"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                    <p className="text-[10px] text-slate-450">Button label for the slide CTA. Defaults to "Explore Deal".</p>
                  </div>

                  {/* Hero Image File Upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Slide Banner Image (Optional)</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => setHeroImageFile(e.target.files[0] || null)}
                      className="text-xs file:bg-slate-200 dark:file:bg-slate-800 file:border-0 file:py-2 file:px-3 file:rounded-lg file:font-extrabold file:text-xs text-slate-400 file:cursor-pointer w-full"
                    />
                    <p className="text-[10px] text-slate-450">
                      Upload a wide aspect ratio image (e.g. 16:9 or 1600x600). If not uploaded, the product's primary image will be displayed.
                    </p>
                    {existingHeroImage && !heroImageFile && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-500">Current slide banner:</span>
                        <img src={existingHeroImage} alt="Existing Hero Slide" className="w-16 h-9 rounded object-cover border" />
                      </div>
                    )}
                    {heroImageFile && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-secondary">New banner preview:</span>
                        <img src={URL.createObjectURL(heroImageFile)} alt="New Hero Slide" className="w-16 h-9 rounded object-cover border border-secondary" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Media files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              {/* Images (Multiple) */}
              <div className="space-y-2 border border-dashed border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/20">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer">
                  <FileImage className="w-4 h-4 text-secondary" />
                  <span>Images {isEditMode ? '(Overwrites Existing)' : '*'}</span>
                </label>
                <input
                  type="file"
                  multiple
                  required={!isEditMode}
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageSelection}
                  className="text-xs file:bg-slate-200 dark:file:bg-slate-800 file:border-0 file:py-1.5 file:px-3 file:rounded-lg file:font-extrabold file:text-xs text-slate-400 file:cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 font-medium">Select 1 to {MAX_PRODUCT_IMAGES} JPG, PNG, or WEBP files. Recommended: 800x450 ratio.</p>
                {imageFiles.length > 0 && (
                  <p className="text-[10px] text-secondary font-semibold">Selected images: {imageFiles.length} of {MAX_PRODUCT_IMAGES}</p>
                )}
              </div>

              {/* Separate media preview section */}
              <div className="space-y-3 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Preview & Upload Summary</p>
                  <p className="text-[10px] text-slate-400 font-medium">This panel keeps the selected media visible so each product upload can be reviewed before publishing.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {imageFiles.length > 0 ? Array.from(imageFiles).map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover" />
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 px-2 py-1.5 truncate">{file.name}</p>
                    </div>
                  )) : <p className="text-[10px] text-slate-400 col-span-2">No files selected yet. Choose images to preview them here.</p>}
                </div>
              </div>

              {/* Video (Single) */}
              <div className="space-y-2 border border-dashed border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/20">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer">
                  <Tv className="w-4 h-4 text-secondary" />
                  <span>Product Video Demo</span>
                </label>
                <input
                  type="file"
                  accept=".mp4"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="text-xs file:bg-slate-200 dark:file:bg-slate-800 file:border-0 file:py-1.5 file:px-3 file:rounded-lg file:font-extrabold file:text-xs text-slate-400 file:cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 font-medium">Supports single MP4 format up to 50MB file size limit.</p>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary hover:bg-secondary-hover text-white py-3.5 px-8 rounded-xl font-bold active-press text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-secondary/15 disabled:bg-secondary/75"
              >
                {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                <span>{loading ? 'Processing Files...' : (isEditMode ? 'Update Product Listing' : 'Publish Product Listing')}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminAddEditProduct;
