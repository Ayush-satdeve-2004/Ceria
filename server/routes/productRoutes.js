const express = require('express');
const {
  getProducts,
  getSearchSuggestions,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin product endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 }
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 }
  ]),
  updateProduct
);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Reviews
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
