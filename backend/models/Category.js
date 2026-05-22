const mongoose = require('mongoose');
module.exports = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  type: { type: String, enum: ['shirt','pant','combo','other'], default: 'other' },
}, { timestamps: true }));
