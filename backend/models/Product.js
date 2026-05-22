const mongoose = require('mongoose');
const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  mrp: { type: Number },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  productType: { type: String, enum: ['shirt','pant','combo','other'], default: 'shirt' },
  shirtSizes: [sizeStockSchema], // S,M,L,XL
  pantSizes: [sizeStockSchema],  // 28..38
  brand: { type: String, default: 'Singh Fashion' },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
