const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, admin, customerOnly } = require('../middleware/authMiddleware');

// Customer-only: create orders, view own orders
router.post('/razorpay', protect, customerOnly, c.createRazorpayOrder);
router.post('/', protect, customerOnly, c.placeOrder);
router.get('/mine', protect, customerOnly, c.myOrders);

// Either role can view a single order detail (admin for management; customer for own).
// Controller should still enforce ownership for non-admins.
router.get('/:id', protect, c.getOrder);

module.exports = router;
