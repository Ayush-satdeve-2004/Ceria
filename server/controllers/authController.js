const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/_\-\.]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character.'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate 6-digit verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      isVerified: false,
      emailVerificationOTP: otp,
      emailVerificationOTPExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send verification email in the background (non-blocking)
    sendEmail({
      email: user.email,
      subject: 'CERIA - Email Verification OTP',
      message: `Welcome to CERIA! Please use the following 6-digit OTP code to verify your email address:\n\n${otp}\n\nThis OTP is valid for 24 hours.`
    }).catch(err => console.error('Email verification send error:', err));

    res.status(201).json({
      success: true,
      message: 'Account created! Please verify your email with the OTP sent to your mailbox.',
      requiresVerification: true,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by the administrator'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailVerificationOTP = otp;
      user.emailVerificationOTPExpires = Date.now() + 24 * 60 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      // Send email in the background (non-blocking)
      sendEmail({
        email: user.email,
        subject: 'CERIA - Email Verification OTP',
        message: `Please use the following 6-digit OTP code to verify your email address:\n\n${otp}\n\nThis OTP is valid for 24 hours.`
      }).catch(err => console.error('Email verification send error on login:', err));

      return res.status(401).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: 'Your email is not verified. A new verification OTP has been sent to your email.'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiry (10 minutes)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send via email utility
    const message = `You requested a password reset. Please use the following 6-digit OTP to reset your password:\n\n${otp}\n\nThis OTP will expire in 10 minutes.`;

    // Send via email utility in background (non-blocking)
    sendEmail({
      email: user.email,
      subject: 'CERIA - Password Reset OTP',
      message
    }).catch(err => {
      console.error('Password reset email send error:', err);
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, otp and new password'
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/_\-\.]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character.'
      });
    }

    // Find user with active OTP and expiry
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code'
      });
    }

    // Set new password
    user.password = password;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, address } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (address !== undefined) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email using OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification OTP code'
      });
    }

    // Find user with matching email, OTP, and expiration date greater than now
    const user = await User.findOne({
      email,
      emailVerificationOTP: otp,
      emailVerificationOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification OTP code'
      });
    }

    // Update user properties
    user.isVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};
