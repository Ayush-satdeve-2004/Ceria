const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'Quantity must be at least 1']
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);
