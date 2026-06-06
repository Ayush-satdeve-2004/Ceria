const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const productsData = [
  {
    name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging (10 min charge for 5 hours of playback). Touch Sensor controls to pause/play/skip tracks, control volume, activate your voice assistant, and answer phone calls.",
    price: 19999,
    category: "Electronics",
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60"
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Free sample video link
    affiliateLink: "https://www.amazon.in/dp/B0863TXGM3",
    sourcePlatform: "Amazon",
    tags: ["headphones", "wireless", "sony", "anc", "music"],
    stockStatus: "In Stock",
    isFeatured: true,
    viewsCount: 245
  },
  {
    name: "Nike Air Max Alpha Training Sneakers",
    description: "Conquer your workout in the Nike Air Max Alpha Trainer. Max Air cushioning offers comfortable stability for lifting, whether it's a light or heavy day. A wide, flat base gives you enhanced stability and grip for all kinds of tough workouts without sacrificing style.",
    price: 6495,
    category: "Shoes",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60"
    ],
    video: "",
    affiliateLink: "https://www.myntra.com/shoes/nike/nike-men-air-max-alpha-5-training-shoes/21264426/buy",
    sourcePlatform: "Myntra",
    tags: ["shoes", "nike", "sneakers", "sports", "running"],
    stockStatus: "In Stock",
    isFeatured: true,
    viewsCount: 189
  },
  {
    name: "Samsung Galaxy S23 Ultra Premium Smartphone",
    description: "More innovation, less footprint. Galaxy S23 Ultra's striking symmetrical design returns with one major difference: recycled and eco-conscious materials. From the metal frame to the glass finish, it's polished with fresh new colors inspired by nature. Capture the night with extreme detail using the 200MP camera sensor.",
    price: 124999,
    category: "Mobiles",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60"
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    affiliateLink: "https://www.amazon.in/dp/B0BY8MCQ9S",
    sourcePlatform: "Amazon",
    tags: ["mobile", "samsung", "galaxy", "android", "5g", "flagship"],
    stockStatus: "In Stock",
    isFeatured: true,
    viewsCount: 512
  },
  {
    name: "Ergonomic Modern Velvet Accent Lounge Chair",
    description: "Elevate your living room aesthetics with this mid-century modern accent lounge chair. Features premium velvet upholstery, padded dense foam cushioning, and sturdy gold-plated stainless steel legs. Provides ultimate comfort while sitting, reading, or relaxing in your master suite or study room.",
    price: 12999,
    category: "Furniture",
    brand: "Urban Ladder",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60"
    ],
    video: "",
    affiliateLink: "https://www.flipkart.com/urban-ladder-solid-wood-accent-chair/p/itm2ca0d7d6b490f",
    sourcePlatform: "Flipkart",
    tags: ["furniture", "chair", "lounge", "sofa", "home", "velvet"],
    stockStatus: "In Stock",
    isFeatured: true,
    viewsCount: 104
  },
  {
    name: "Slim Fit Classic Men's Linen Blazer",
    description: "Upgrade your semi-formal styling with this premium linen blazer. Handcrafted with a breathable organic linen-cotton blend. Features a notched lapel collar, two-button front fastening, dual side vents, and multiple functional pockets. Ideal for office events, dinner dates, and summer gatherings.",
    price: 3499,
    category: "Fashion",
    brand: "Zara",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60"
    ],
    video: "",
    affiliateLink: "https://www.ajio.com/zara-men-slim-fit-structured-blazer/p/465223011_blue",
    sourcePlatform: "Ajio",
    tags: ["fashion", "clothing", "blazer", "men", "formal", "linen"],
    stockStatus: "In Stock",
    isFeatured: false,
    viewsCount: 88
  },
  {
    name: "Hydrating Rosewater & Hyaluronic Acid Facial Serum",
    description: "Achieve radiant, plump, and glowing skin. Infused with natural Bulgarian rose distillate, 2% pure hyaluronic acid, and vitamin B5. Instantly lock in moisture, calm redness, and reduce fine dry lines. 100% vegan, cruelty-free, and paraben-free formulation suitable for all skin types.",
    price: 899,
    category: "Beauty",
    brand: "The Derma Co",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60"
    ],
    video: "",
    affiliateLink: "https://www.meesho.com/hyaluronic-acid-face-serum-for-glowing-skin-rose-extracts-30ml/p/3o7kws",
    sourcePlatform: "Meesho",
    tags: ["beauty", "skin", "serum", "hydrating", "organic", "skincare"],
    stockStatus: "In Stock",
    isFeatured: false,
    viewsCount: 167
  },
  {
    name: "Minimalist Full Grain Leather Messenger Bag",
    description: "Designed for modern professionals. Handcrafted from 100% full-grain oily pull-up leather that develops a gorgeous vintage patina over time. Fits up to a 15.6-inch laptop in a dedicated padded sleeve. Equipped with heavy-duty YKK brass zippers and an adjustable padded shoulder strap.",
    price: 4999,
    category: "Accessories",
    brand: "Wildhorn",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=60"
    ],
    video: "",
    affiliateLink: "https://www.amazon.in/Wildhorn-Brown-Leather-Messenger-Laptop/dp/B07N1M6SMW",
    sourcePlatform: "Amazon",
    tags: ["accessories", "leather", "bag", "laptop", "office", "messenger"],
    stockStatus: "In Stock",
    isFeatured: false,
    viewsCount: 122
  },
  {
    name: "Digital Multi-Cooker & Smart Air Fryer Elite",
    description: "Prepare healthy meals in minutes. Features a 12-in-1 digital preset touch menu covering air frying, roasting, baking, pressure cooking, and dehydrating. Uses 360-degree rapid heat circulation to fry food using 85% less oil than traditional deep frying. Includes non-stick dishwasher-safe fry basket.",
    price: 8499,
    category: "Home Appliances",
    brand: "Philips",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=60"
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    affiliateLink: "https://www.flipkart.com/philips-spectacular-digital-air-fryer/p/itm5a84ea8925fa3",
    sourcePlatform: "Flipkart",
    tags: ["appliances", "kitchen", "philips", "airfryer", "cooking", "healthy"],
    stockStatus: "In Stock",
    isFeatured: false,
    viewsCount: 140
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // 1. Clear database
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();
    console.log('Collections cleared.');

    // 2. Create Admin Account
    console.log('Creating Admin Account...');
    const admin = await User.create({
      name: 'CERIA Admin',
      email: process.env.ADMIN_EMAIL || 'satdeve2004@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'CeriaAdmin@2026!Secure',
      mobile: '9876543210',
      role: 'admin',
      address: 'CERIA Head Office, Mumbai, India',
      isVerified: true
    });
    console.log(`Admin account seeded: ${admin.email}`);

    // 3. Create Customer Account for Reviews
    console.log('Creating Customer Accounts...');
    const customer = await User.create({
      name: 'Ayush Satdeve',
      email: 'ayush.customer@ceria.com',
      password: 'CeriaCustomer@2026!',
      mobile: '9876543211',
      role: 'customer',
      address: 'Flat 402, Royal Residency, Pune, India',
      isVerified: true
    });
    console.log(`Customer account seeded: ${customer.email}`);

    const customer2 = await User.create({
      name: 'Sneha Sharma',
      email: 'sneha.sharma@gmail.com',
      password: 'CeriaCustomer2@2026!',
      mobile: '9876543212',
      role: 'customer',
      address: 'Bunglow 12, Green Valleys, Bangalore, India',
      isVerified: true
    });
    console.log(`Second Customer account seeded: ${customer2.email}`);

    // 4. Create Products
    console.log('Seeding Products...');
    const seededProducts = await Product.insertMany(productsData);
    console.log(`${seededProducts.length} Products seeded successfully.`);

    // 5. Create Reviews for seeded products
    console.log('Seeding Product Reviews...');
    
    // Review for Sony Headphone
    await Review.create({
      product: seededProducts[0]._id,
      user: customer._id,
      name: customer.name,
      rating: 5,
      comment: "Absolutely outstanding sound signature and active noise cancelling! Battery lasts forever."
    });

    await Review.create({
      product: seededProducts[0]._id,
      user: customer2._id,
      name: customer2.name,
      rating: 4,
      comment: "Perfect for work-from-home calls. Noise isolation is great, though the ear cups get slightly warm after hours of continuous wear."
    });

    // Review for Nike Shoe
    await Review.create({
      product: seededProducts[1]._id,
      user: customer._id,
      name: customer.name,
      rating: 4,
      comment: "Great grip for deadlifts and squats. Fits true to size and looks very premium."
    });

    // Review for Samsung S23 Ultra
    await Review.create({
      product: seededProducts[2]._id,
      user: customer2._id,
      name: customer2.name,
      rating: 5,
      comment: "The 200MP camera is mindblowing! The integrated S-Pen works like magic."
    });

    // Review for velvet chair
    await Review.create({
      product: seededProducts[3]._id,
      user: customer._id,
      name: customer.name,
      rating: 5,
      comment: "It looks incredibly luxurious in my living room. Very sturdy and comfortable."
    });

    // We trigger rating calculations manually by saving the reviews or calling getAverageRating
    for (const prod of seededProducts) {
      await Review.getAverageRating(prod._id);
    }

    console.log('Seeding Reviews completed successfully.');
    console.log('Database Seeding finished. Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
