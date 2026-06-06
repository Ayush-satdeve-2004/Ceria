const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order (Muti-product affiliate checkout)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order payload'
      });
    }

    // Create order entry with status Redirected
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      status: 'Redirected' // Instantly marked redirected as they head to affiliate links
    });

    // Clear the products purchased from the user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      const productIds = items.map(item => item.product.toString());
      cart.items = cart.items.filter(
        item => !productIds.includes(item.product.toString())
      );
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order recorded and redirecting to affiliate portals',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (User's own history, or all orders for Admin)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      // Admin sees all orders with populated user names
      orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    } else {
      // Users see only their own orders
      orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check user ownership or admin authority
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Products
    const totalProducts = await Product.countDocuments();

    // 2. Total Users
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // 3. Total Orders
    const totalOrders = await Order.countDocuments();

    // 4. Total Cart Items in databases (active shopping intent)
    const carts = await Cart.find();
    let totalCartItems = 0;
    carts.forEach(cart => {
      cart.items.forEach(item => {
        totalCartItems += item.quantity;
      });
    });

    // 5. Revenue Estimation (8% commission of redirected checkouts)
    const orders = await Order.find();
    let totalTransactionVolume = 0;
    orders.forEach(order => {
      totalTransactionVolume += order.totalAmount;
    });
    const revenueEstimation = Math.round(totalTransactionVolume * 0.08); // 8% average commission fee

    // 6. Most Viewed Products (top 5 sorted by viewsCount desc)
    const mostViewedProducts = await Product.find()
      .sort('-viewsCount')
      .limit(5);

    // 7. Monthly analytics (grouped transaction charts data for analytics page)
    const salesGroup = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = salesGroup.map(item => ({
      month: months[item._id - 1] || 'Unknown',
      sales: item.sales,
      commissions: Math.round(item.sales * 0.08),
      orders: item.count
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalCartItems,
        totalOrders,
        revenueEstimation,
        totalTransactionVolume,
        mostViewedProducts,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};
