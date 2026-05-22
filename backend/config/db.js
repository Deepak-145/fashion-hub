const mongoose = require('mongoose');
module.exports = async function connectDB() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing in .env');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('DB error:', err.message);
    process.exit(1);
  }
};
