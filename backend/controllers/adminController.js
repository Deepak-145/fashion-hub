const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

const stats = asyncHandler(async (_, res) => {
  const [users, orders, products, revenueAgg, recent] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
  ]);
  res.json({
    users, orders, products,
    revenue: revenueAgg[0]?.total || 0,
    recentOrders: recent,
  });
});

const listUsers = asyncHandler(async (_, res) =>
  res.json(await User.find().select('-password').sort({ createdAt: -1 })));

const setUserRole = asyncHandler(async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(u);
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const listOrders = asyncHandler(async (_, res) =>
  res.json(await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 })));

const updateOrderStatus = asyncHandler(async (req, res) => {
  const update = { status: req.body.status };
  // Mark COD as paid on delivery
  if (req.body.status === 'Delivered') {
    const o = await Order.findById(req.params.id);
    if (o && o.paymentMethod === 'COD' && !o.isPaid) {
      update.isPaid = true;
      update.paidAt = new Date();
    }
  }
  const o = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(o);
});

module.exports = { stats, listUsers, setUserRole, deleteUser, listOrders, updateOrderStatus };
