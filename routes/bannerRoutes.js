const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');

// Create upload middleware for banners
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const bannersUploadDir = path.join(__dirname, '../uploads/banners');
if (!fs.existsSync(bannersUploadDir)) {
  fs.mkdirSync(bannersUploadDir, { recursive: true });
}

const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bannersUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

const bannerUpload = multer({
  storage: bannerStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG images are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST /api/banners
// @desc    Create a new banner with image upload
// @access  Public
router.post('/', bannerUpload.single('image'), createBanner);

// @route   GET /api/banners
// @desc    Get all banners
// @access  Public
router.get('/', getAllBanners);

// @route   GET /api/banners/:id
// @desc    Get single banner by ID
// @access  Public
router.get('/:id', getBannerById);

// @route   PUT /api/banners/:id
// @desc    Update banner by ID
// @access  Public
router.put('/:id', bannerUpload.single('image'), updateBanner);

// @route   DELETE /api/banners/:id
// @desc    Delete banner by ID
// @access  Public
router.delete('/:id', deleteBanner);

module.exports = router;
