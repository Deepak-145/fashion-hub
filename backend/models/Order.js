const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  shirtSize: String,
  pantSize: String,
  quantity: Number,
}, { _id: false });

module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { name: String, phone: String, line1: String, city: String, state: String, pincode: String, country: String },
  itemsTotal: Number,
  shippingFee: { type: Number, default: 0 },
  total: Number,
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentResult: { razorpay_order_id: String, razorpay_payment_id: String, razorpay_signature: String, status: String },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  status: { type: String, enum: ['Pending','Processing','Shipped','Delivered','Cancelled'], default: 'Pending' },
}, { timestamps: true }));
