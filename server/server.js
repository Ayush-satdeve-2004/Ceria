const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Load environment variables with absolute path relative to __dirname
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

// Error Handler Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Body parser + cookie parser
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  })
);

// Set secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false // Allows serving local files cross-origin
  })
);

// Sanitize data to prevent NoSQL query injections
app.use(mongoSanitize());

// Ensure uploads directory exists and is exposed statically
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);

// Basic Welcome API Root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the CERIA Affiliate E-Commerce Platform API'
  });
});

// Centralized error handling middleware (must be after routes)
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = (port, attemptsLeft = 5) => {
  const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    process.env.PORT = String(port);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${nextPort}...`);
      server.close(() => startServer(nextPort, attemptsLeft - 1));
      return;
    }

    console.error('Server error:', err);
    if (err.code !== 'EADDRINUSE') {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer(DEFAULT_PORT);
