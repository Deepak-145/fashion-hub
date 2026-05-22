const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  if (!token) { res.status(401); throw new Error('Not authorized, no token'); }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) { res.status(401); throw new Error('User not found'); }
    next();
  } catch {
    res.status(401); throw new Error('Token invalid');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403); throw new Error('Admin only');
};

// Block admins from shopping endpoints (cart, wishlist, checkout, orders).
// Admins must use the admin panel; they cannot place customer orders.
const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admins are not allowed to shop. Please use a customer account.');
  }
  next();
};

module.exports = { protect, admin, customerOnly };
