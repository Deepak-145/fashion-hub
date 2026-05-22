const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const { enabled } = require('../config/cloudinary');

router.post('/', protect, admin, upload.array('images', 6), (req, res) => {
  const urls = req.files.map(f => enabled ? f.path : `/uploads/${f.filename}`);
  res.json({ urls });
});
module.exports = router;
