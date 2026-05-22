const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const listForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
});

const create = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) { res.status(400); throw new Error('Already reviewed'); }
  const review = await Review.create({ product: productId, user: req.user._id, name: req.user.name, rating, comment });
  const all = await Review.find({ product: productId });
  const avg = all.reduce((a,b) => a + b.rating, 0) / all.length;
  await Product.findByIdAndUpdate(productId, { rating: avg, numReviews: all.length });
  res.status(201).json(review);
});

module.exports = { listForProduct, create };
