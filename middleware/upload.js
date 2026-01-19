const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Creates a multer upload middleware for different upload types
 * @param {string} folder - Folder name under uploads/ (e.g., 'products', 'categories', 'banners')
 * @param {number} maxSize - Max file size in bytes (default: 5MB)
 * @param {string[]} allowedTypes - Allowed MIME types (default: jpeg, jpg, png, gif, webp)
 * @returns {multer.Multer} Configured multer instance
 */
const createUploadMiddleware = (folder, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
  const uploadDir = path.join(__dirname, `../uploads/${folder}`);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize }
  });
};

// Export factory function and pre-configured instances
module.exports = {
  createUploadMiddleware,
  productUpload: createUploadMiddleware('products', 5 * 1024 * 1024),
  categoryUpload: createUploadMiddleware('categories', 2 * 1024 * 1024),
  bannerUpload: createUploadMiddleware('banners', 5 * 1024 * 1024),
};
