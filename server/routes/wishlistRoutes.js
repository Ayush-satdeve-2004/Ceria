const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

module.exports = router;
