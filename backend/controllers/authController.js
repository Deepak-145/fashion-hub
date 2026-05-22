const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) { res.status(400); throw new Error('User exists'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid credentials'); }
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
});

const me = asyncHandler(async (req, res) => res.json(req.user));

const updateProfile = asyncHandler(async (req, res) => {
  const u = await User.findById(req.user._id);
  u.name = req.body.name ?? u.name;
  u.phone = req.body.phone ?? u.phone;
  u.address = req.body.address ?? u.address;
  if (req.body.password) u.password = req.body.password;
  await u.save();
  res.json({ _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone, address: u.address });
});

module.exports = { register, login, me, updateProfile };
