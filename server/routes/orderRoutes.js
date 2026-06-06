const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  getAdminStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/admin/stats', authorize('admin'), getAdminStats);
router.get('/:id', getOrderById);

module.exports = router;
