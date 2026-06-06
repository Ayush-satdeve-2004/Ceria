const mongoose = require('mongoose');

const connectDB = async (retries = 5, delayMs = 3000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed. Retrying in ${delayMs / 1000}s... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return connectDB(retries - 1, delayMs);
    }

    console.error('MongoDB Connection Error:', error.message);
    console.error('Atlas DB is unavailable. The server will continue, but login/products will fail until the Atlas IP is whitelisted or a different DB is configured.');
    return null;
  }
};

module.exports = connectDB;
