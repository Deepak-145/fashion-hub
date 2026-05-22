const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  shirtSize: String,
  pantSize: String,
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: true });
module.exports = mongoose.model('Cart', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [itemSchema],
}, { timestamps: true }));
