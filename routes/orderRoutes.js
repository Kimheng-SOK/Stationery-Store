const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Public
router.get('/:id', getOrderById);

// @route   PUT /api/orders/:id
// @desc    Update order by ID
// @access  Public
router.put('/:id', updateOrder);

// @route   DELETE /api/orders/:id
// @desc    Delete order by ID
// @access  Public
router.delete('/:id', deleteOrder);

module.exports = router;
