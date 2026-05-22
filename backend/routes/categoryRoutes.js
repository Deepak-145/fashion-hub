const router = require('express').Router();
const c = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
router.get('/', c.list);
router.post('/', protect, admin, c.create);
router.put('/:id', protect, admin, c.update);
router.delete('/:id', protect, admin, c.remove);
module.exports = router;
