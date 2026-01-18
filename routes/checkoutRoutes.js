const express = require('express');
const router = express.Router();
const {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  getCheckoutByOrderNumber,
  updateCheckout,
  deleteCheckout
} = require('../controllers/checkoutController');

// @route   POST /api/checkout
// @desc    Create a new checkout order
// @access  Public
router.post('/', createCheckout);

// @route   GET /api/checkout
// @desc    Get all checkout orders
// @access  Public
router.get('/', getAllCheckouts);

// @route   GET /api/checkout/order/:orderNumber
// @desc    Get checkout by order number
// @access  Public
router.get('/order/:orderNumber', getCheckoutByOrderNumber);

// @route   GET /api/checkout/:id
// @desc    Get single checkout by ID
// @access  Public
router.get('/:id', getCheckoutById);

// @route   PUT /api/checkout/:id
// @desc    Update checkout order by ID
// @access  Public
router.put('/:id', updateCheckout);

// @route   DELETE /api/checkout/:id
// @desc    Delete checkout order by ID
// @access  Public
router.delete('/:id', deleteCheckout);

module.exports = router;
