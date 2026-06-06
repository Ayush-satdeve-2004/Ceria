const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { uploadMedia } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-1',
    name: 'Aurora Smart Lamp',
    brand: 'Lumora',
    category: 'Home Appliances',
    price: 49.99,
    rating: 4.8,
    viewsCount: 128,
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80'],
    description: 'Warm ambient lighting with app controls and voice assistant support.',
    isFeatured: true,
    stockStatus: 'In Stock',
    tags: ['lighting', 'smart-home'],
    createdAt: new Date().toISOString(),
    affiliateLink: '#'
  },
  {
    _id: 'fallback-2',
    name: 'Nova Wireless Headphones',
    brand: 'AudioX',
    category: 'Electronics',
    price: 89.0,
    rating: 4.7,
    viewsCount: 96,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
    description: 'Noise-cancelling Bluetooth headphones with 30-hour battery life.',
    isFeatured: true,
    stockStatus: 'In Stock',
    tags: ['audio', 'wireless'],
    createdAt: new Date().toISOString(),
    affiliateLink: '#'
  },
  {
    _id: 'fallback-3',
    name: 'Luna Running Shoes',
    brand: 'Stride',
    category: 'Shoes',
    price: 64.5,
    rating: 4.6,
    viewsCount: 74,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80'],
    description: 'Lightweight running shoes designed for all-day comfort.',
    isFeatured: true,
    stockStatus: 'In Stock',
    tags: ['sports', 'running'],
    createdAt: new Date().toISOString(),
    affiliateLink: '#'
  }
];

const isMongoReady = () => mongoose.connection.readyState === 1;

const validateImageUpload = (uploadedImages = [], existingImages = []) => {
  if (uploadedImages.length > 5) {
    return {
      ok: false,
      message: 'You can upload a maximum of 5 product images.'
    };
  }

  if (uploadedImages.length === 0 && (!Array.isArray(existingImages) || existingImages.length === 0)) {
    return {
      ok: false,
      message: 'Please upload at least 1 product image.'
    };
  }

  return { ok: true };
};

const filterFallbackProducts = (products, query = {}, sortBy = '-createdAt', skip = 0, limit = 12) => {
  let result = [...products];

  if (query.$or) {
    const regex = new RegExp(query.$or[0].name.$regex, 'i');
    result = result.filter(item => regex.test(item.name) || regex.test(item.brand) || regex.test(item.category));
  }

  if (query.category) {
    result = result.filter(item => item.category === query.category);
  }

  if (query.brand) {
    result = result.filter(item => item.brand === query.brand);
  }

  if (query.price) {
    result = result.filter(item => item.price >= (query.price.$gte || 0) && item.price <= (query.price.$lte || Number.MAX_SAFE_INTEGER));
  }

  if (query.rating) {
    result = result.filter(item => item.rating >= query.rating.$gte);
  }

  if (sortBy === 'price') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === '-price') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === '-rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === '-viewsCount') {
    result.sort((a, b) => b.viewsCount - a.viewsCount);
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return result.slice(skip, skip + Number(limit));
};

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search filter (Name, Brand, Category, Tags)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sorting
    let sortBy = '-createdAt'; // Default: latest
    if (sort === 'priceAsc') sortBy = 'price';
    if (sort === 'priceDesc') sortBy = '-price';
    if (sort === 'rating') sortBy = '-rating';
    if (sort === 'views') sortBy = '-viewsCount';

    if (!isMongoReady()) {
      const fallbackProducts = filterFallbackProducts(FALLBACK_PRODUCTS, query, sortBy, skip, Number(limit));
      return res.status(200).json({
        success: true,
        count: fallbackProducts.length,
        pagination: {
          total: FALLBACK_PRODUCTS.length,
          pages: Math.ceil(FALLBACK_PRODUCTS.length / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit)
        },
        products: fallbackProducts,
        note: 'Using demo product data because Atlas MongoDB is currently unavailable in this environment.'
      });
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live search suggestions
// @route   GET /api/products/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    if (!isMongoReady()) {
      const query = new RegExp(q, 'i');
      const products = FALLBACK_PRODUCTS.filter(item => query.test(item.name) || query.test(item.brand) || query.test(item.category)).slice(0, 5);
      return res.status(200).json({ success: true, suggestions: products });
    }

    // Query matching names or brands (limit 5 for fast response)
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name brand category')
      .limit(5);

    res.status(200).json({
      success: true,
      suggestions: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const product = FALLBACK_PRODUCTS.find(item => item._id === req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, product });
    }

    const product = await Product.findById(req.params.id).populate('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views count
    product.viewsCount += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      affiliateLink,
      sourcePlatform,
      tags,
      colorOptions,
      showColorOptions,
      designOptions,
      showDesignOptions,
      stockStatus,
      isFeatured,
      showOnHero,
      heroTitle,
      heroSubtitle,
      heroBadge,
      heroCta
    } = req.body;

    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
    const parsedColorOptions = colorOptions ? (Array.isArray(colorOptions) ? colorOptions : colorOptions.split(',').map(t => t.trim()).filter(Boolean)) : [];
    const parsedDesignOptions = designOptions ? (Array.isArray(designOptions) ? designOptions : designOptions.split(',').map(t => t.trim()).filter(Boolean)) : [];
    const uploadedImages = req.files?.images || [];

    const validation = validateImageUpload(uploadedImages);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    let imageUrls = [];
    let videoUrl = '';
    let heroImageUrl = '';

    // Handle files upload
    if (req.files) {
      // 1. Process multiple images
      if (req.files.images) {
        for (const file of req.files.images) {
          const cloudinaryUrl = await uploadMedia(file.path, 'ceria/images');
          if (cloudinaryUrl) {
            imageUrls.push(cloudinaryUrl);
          } else {
            // Keep local relative path
            imageUrls.push(`/uploads/${path.basename(file.path)}`);
          }
        }
      }

      // 2. Process video
      if (req.files.video && req.files.video[0]) {
        const file = req.files.video[0];
        const cloudinaryUrl = await uploadMedia(file.path, 'ceria/videos');
        if (cloudinaryUrl) {
          videoUrl = cloudinaryUrl;
        } else {
          // Keep local relative path
          videoUrl = `/uploads/${path.basename(file.path)}`;
        }
      }

      // 3. Process hero image
      if (req.files.heroImage && req.files.heroImage[0]) {
        const file = req.files.heroImage[0];
        const cloudinaryUrl = await uploadMedia(file.path, 'ceria/hero_images');
        if (cloudinaryUrl) {
          heroImageUrl = cloudinaryUrl;
        } else {
          heroImageUrl = `/uploads/${path.basename(file.path)}`;
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand,
      images: imageUrls,
      video: videoUrl,
      affiliateLink,
      sourcePlatform,
      tags: parsedTags,
      colorOptions: parsedColorOptions,
      showColorOptions: showColorOptions === 'true' || showColorOptions === true,
      designOptions: parsedDesignOptions,
      showDesignOptions: showDesignOptions === 'true' || showDesignOptions === true,
      stockStatus: stockStatus || 'In Stock',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      showOnHero: showOnHero === 'true' || showOnHero === true,
      heroImage: heroImageUrl,
      heroTitle: heroTitle || '',
      heroSubtitle: heroSubtitle || '',
      heroBadge: heroBadge || '',
      heroCta: heroCta || ''
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      affiliateLink,
      sourcePlatform,
      tags,
      colorOptions,
      showColorOptions,
      designOptions,
      showDesignOptions,
      stockStatus,
      isFeatured,
      showOnHero,
      heroTitle,
      heroSubtitle,
      heroBadge,
      heroCta
    } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (brand) updateData.brand = brand;
    if (affiliateLink) updateData.affiliateLink = affiliateLink;
    if (sourcePlatform) updateData.sourcePlatform = sourcePlatform;
    if (stockStatus) updateData.stockStatus = stockStatus;
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (showOnHero !== undefined) {
      updateData.showOnHero = showOnHero === 'true' || showOnHero === true;
    }
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle;
    if (heroBadge !== undefined) updateData.heroBadge = heroBadge;
    if (heroCta !== undefined) updateData.heroCta = heroCta;

    if (tags) {
      updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }
    if (colorOptions !== undefined) {
      updateData.colorOptions = Array.isArray(colorOptions) ? colorOptions : colorOptions.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (showColorOptions !== undefined) {
      updateData.showColorOptions = showColorOptions === 'true' || showColorOptions === true;
    }
    if (designOptions !== undefined) {
      updateData.designOptions = Array.isArray(designOptions) ? designOptions : designOptions.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (showDesignOptions !== undefined) {
      updateData.showDesignOptions = showDesignOptions === 'true' || showDesignOptions === true;
    }

    // Keep existing images & video or add new
    let imageUrls = [...product.images];
    let videoUrl = product.video;
    let heroImageUrl = product.heroImage;
    const uploadedImages = req.files?.images || [];

    const validation = validateImageUpload(uploadedImages, product.images);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // Handle files upload if new are provided
    if (req.files) {
      // Images
      if (req.files.images && req.files.images.length > 0) {
        // Clear previous images if required, or append. Let's replace for Edit Product.
        imageUrls = [];
        for (const file of req.files.images) {
          const cloudinaryUrl = await uploadMedia(file.path, 'ceria/images');
          if (cloudinaryUrl) {
            imageUrls.push(cloudinaryUrl);
          } else {
            imageUrls.push(`/uploads/${path.basename(file.path)}`);
          }
        }
      }

      // Video
      if (req.files.video && req.files.video[0]) {
        const file = req.files.video[0];
        const cloudinaryUrl = await uploadMedia(file.path, 'ceria/videos');
        if (cloudinaryUrl) {
          videoUrl = cloudinaryUrl;
        } else {
          videoUrl = `/uploads/${path.basename(file.path)}`;
        }
      }

      // Hero Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        // Clean up previous local heroImage if any
        if (product.heroImage && product.heroImage.startsWith('/uploads/')) {
          const localPath = path.join(__dirname, '..', product.heroImage);
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        }

        const file = req.files.heroImage[0];
        const cloudinaryUrl = await uploadMedia(file.path, 'ceria/hero_images');
        if (cloudinaryUrl) {
          heroImageUrl = cloudinaryUrl;
        } else {
          heroImageUrl = `/uploads/${path.basename(file.path)}`;
        }
      }
    }

    if (imageUrls.length > 0) updateData.images = imageUrls;
    if (videoUrl) updateData.video = videoUrl;
    updateData.heroImage = heroImageUrl;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Clean up local media files if they exist
    product.images.forEach(img => {
      if (img.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', img);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }
    });

    if (product.video && product.video.startsWith('/uploads/')) {
      const localVideoPath = path.join(__dirname, '..', product.video);
      if (fs.existsSync(localVideoPath)) {
        fs.unlinkSync(localVideoPath);
      }
    }

    if (product.heroImage && product.heroImage.startsWith('/uploads/')) {
      const localHeroPath = path.join(__dirname, '..', product.heroImage);
      if (fs.existsSync(localHeroPath)) {
        fs.unlinkSync(localHeroPath);
      }
    }

    // Delete reviews
    await Review.deleteMany({ product: product._id });
    
    // Delete product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product and associated reviews deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user.id
    });

    if (alreadyReviewed) {
      // If already reviewed, update the existing review (Edit Review feature)
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();

      // Trigger recalculation of product average rating
      await Review.getAverageRating(productId);

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully'
      });
    }

    // Create new review
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommendations & featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      return res.status(200).json({
        success: true,
        heroProducts: [],
        featured: FALLBACK_PRODUCTS.slice(0, 3),
        latest: FALLBACK_PRODUCTS.slice(0, 3),
        trending: FALLBACK_PRODUCTS.slice(0, 3),
        note: 'Using demo products because Atlas MongoDB is unavailable.'
      });
    }

    const heroProducts = await Product.find({ showOnHero: true }).limit(10);
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const latest = await Product.find({}).sort('-createdAt').limit(8);
    const trending = await Product.find({}).sort('-viewsCount').limit(8);

    res.status(200).json({
      success: true,
      heroProducts,
      featured,
      latest,
      trending
    });
  } catch (error) {
    next(error);
  }
};
