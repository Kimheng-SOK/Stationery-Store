const Customer = require('../models/Customer');

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, memberSince, purchasedItems, rewardPoints, avatar } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required'
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      memberSince: memberSince ? new Date(memberSince) : new Date(),
      purchasedItems: purchasedItems || 0,
      rewardPoints: rewardPoints || 0,
      avatar: avatar || null
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
};

// @desc    Get all customers with pagination
// @route   GET /api/customers
// @access  Public
const getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Customer.countDocuments();

    res.status(200).json({
      success: true,
      data: customers,
      total,
      page,
      pageSize
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Public
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error.message
    });
  }
};

// @desc    Update customer by ID
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message
    });
  }
};

// @desc    Delete customer by ID
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
