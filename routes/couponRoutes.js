const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  redeemCoupon
} = require('../controllers/couponController');

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Public
router.post('/', createCoupon);

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Public
router.get('/', getAllCoupons);

// @route   GET /api/coupons/code/:code
// @desc    Get coupon by code (for validation)
// @access  Public
router.get('/code/:code', getCouponByCode);

// @route   GET /api/coupons/:id
// @desc    Get single coupon by ID
// @access  Public
router.get('/:id', getCouponById);

// @route   PUT /api/coupons/:id
// @desc    Update coupon by ID
// @access  Public
router.put('/:id', updateCoupon);

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon by ID
// @access  Public
router.delete('/:id', deleteCoupon);

// @route   POST /api/coupons/redeem/:code
// @desc    Redeem coupon by code (increment usedCount)
// @access  Public
router.post('/redeem/:code', redeemCoupon);

module.exports = router;