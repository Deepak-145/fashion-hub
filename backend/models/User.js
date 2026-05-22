const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  phone: String,
  address: { line1: String, city: String, state: String, pincode: String, country: { type: String, default: 'India' } },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function(pw) { return bcrypt.compare(pw, this.password); };
module.exports = mongoose.model('User', userSchema);
