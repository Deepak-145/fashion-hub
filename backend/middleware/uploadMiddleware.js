const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, enabled } = require('../config/cloudinary');

let storage;
if (enabled) {
  storage = new CloudinaryStorage({ cloudinary, params: { folder: 'singh-fashion', allowed_formats: ['jpg','jpeg','png','webp'] } });
} else {
  const dir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`),
  });
}
module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
