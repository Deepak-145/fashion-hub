const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const list = asyncHandler(async (req, res) => {
  const { q, category, type, featured, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (type) filter.productType = type;
  if (featured) filter.isFeatured = true;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).populate('category').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

const getOne = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id).populate('category');
  if (!p) { res.status(404); throw new Error('Product not found'); }
  res.json(p);
});

const create = asyncHandler(async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json(p);
});

const update = asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) { res.status(404); throw new Error('Not found'); }
  res.json(p);
});

const remove = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = { list, getOne, create, update, remove };
