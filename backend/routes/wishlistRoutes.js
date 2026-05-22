const router = require('express').Router();
const c = require('../controllers/wishlistController');
const { protect, customerOnly } = require('../middleware/authMiddleware');
router.use(protect, customerOnly);
router.get('/', c.get);
router.post('/toggle', c.toggle);
module.exports = router;
