const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a slide title'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  badge: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add a slide banner image']
  },
  cta: {
    type: String,
    default: 'Explore Deal'
  },
  link: {
    type: String,
    default: '/'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
