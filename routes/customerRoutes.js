const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Public
router.post('/', createCustomer);

// @route   GET /api/customers
// @desc    Get all customers with pagination
// @access  Public
router.get('/', getAllCustomers);

// @route   GET /api/customers/:id
// @desc    Get single customer by ID
// @access  Public
router.get('/:id', getCustomerById);

// @route   PUT /api/customers/:id
// @desc    Update customer by ID
// @access  Public
router.put('/:id', updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer by ID
// @access  Public
router.delete('/:id', deleteCustomer);

module.exports = router;
