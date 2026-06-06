const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length >= 1 && value.length <= 5;
      },
      message: 'A product must have between 1 and 5 images.'
    }
  },
  video: {
    type: String,
    default: ''
  },
  affiliateLink: {
    type: String,
    required: [true, 'Please add an affiliate link']
  },
  sourcePlatform: {
    type: String,
    required: [true, 'Please specify the affiliate source platform (e.g. Amazon, Flipkart)'],
    enum: ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Ajio', 'Other'],
    default: 'Other'
  },
  colorOptions: {
    type: [String],
    default: []
  },
  showColorOptions: {
    type: Boolean,
    default: false
  },
  designOptions: {
    type: [String],
    default: []
  },
  showDesignOptions: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  showOnHero: {
    type: Boolean,
    default: false
  },
  heroImage: {
    type: String,
    default: ''
  },
  heroTitle: {
    type: String,
    default: ''
  },
  heroSubtitle: {
    type: String,
    default: ''
  },
  heroBadge: {
    type: String,
    default: ''
  },
  heroCta: {
    type: String,
    default: ''
  },
  viewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with Reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

module.exports = mongoose.model('Product', ProductSchema);
