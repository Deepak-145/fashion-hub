const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const get = asyncHandler(async (req, res) => {
  const w = await Wishlist.findOne({ user: req.user._id }).populate('products');
  res.json(w || { products: [] });
});
const toggle = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let w = await Wishlist.findOne({ user: req.user._id });
  if (!w) w = await Wishlist.create({ user: req.user._id, products: [] });
  const i = w.products.findIndex(p => String(p) === String(productId));
  if (i >= 0) w.products.splice(i, 1); else w.products.push(productId);
  await w.save();
  await w.populate('products');
  res.json(w);
});
module.exports = { get, toggle };
