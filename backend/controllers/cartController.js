const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { user: req.user._id, items: [] });
});

const addItem = asyncHandler(async (req, res) => {
  const { product, shirtSize, pantSize, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existing = cart.items.find(i => String(i.product) === String(product) && i.shirtSize === shirtSize && i.pantSize === pantSize);
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ product, shirtSize, pantSize, quantity });
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  item.quantity = Math.max(1, Number(req.body.quantity || 1));
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter(i => String(i._id) !== req.params.itemId);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ ok: true });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
