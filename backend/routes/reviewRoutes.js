const router = require('express').Router();
const c = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
router.get('/product/:productId', c.listForProduct);
router.post('/', protect, c.create);
module.exports = router;
