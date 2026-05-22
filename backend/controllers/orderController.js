const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { getRazorpay } = require('../config/razorpay');

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });
  res.json({ id: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
});

const placeOrder = asyncHandler(async (req, res) => {
  const {
    items, shippingAddress, itemsTotal, shippingFee = 0, total,
    paymentMethod = 'Razorpay', paymentResult,
  } = req.body;

  if (!items?.length) { res.status(400); throw new Error('No items'); }

  let orderDoc;

  if (paymentMethod === 'COD') {
    orderDoc = {
      user: req.user._id, items, shippingAddress, itemsTotal, shippingFee, total,
      paymentMethod: 'COD',
      isPaid: false,
      status: 'Pending',
    };
  } else {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResult || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400); throw new Error('Missing payment details');
    }
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) { res.status(400); throw new Error('Invalid payment signature'); }

    orderDoc = {
      user: req.user._id, items, shippingAddress, itemsTotal, shippingFee, total,
      paymentMethod: 'Razorpay',
      paymentResult: { ...paymentResult, status: 'paid' },
      isPaid: true, paidAt: new Date(), status: 'Processing',
    };
  }

  const order = await Order.create(orderDoc);
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
});

const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) { res.status(404); throw new Error('Not found'); }
  if (String(order.user?._id || order.user) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403); throw new Error('Forbidden');
  }
  res.json(order);
});

module.exports = { createRazorpayOrder, placeOrder, myOrders, getOrder };
