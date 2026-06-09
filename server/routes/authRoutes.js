const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  getMe,
  updateProfile,
  emailDiagnostic,
  resendVerification
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/email-diagnostic', emailDiagnostic);
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/logout', protect, logout);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
