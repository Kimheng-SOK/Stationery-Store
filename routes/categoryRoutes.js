const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isAdmin } = require('../middleware/auth');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// @route   POST /api/categories
// @desc    Create a new category
// @access  Admin only (auth temporarily disabled for testing)
router.post('/', categoryUpload.single('image'), createCategory);

// @route   GET /api/categories
// @desc    Get all categories with optional filtering and nested structure
// @access  Public
// @query   parent, isActive, nested, includeProducts
router.get('/', getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   PUT /api/categories/:id
// @desc    Update category by ID
// @access  Admin only (auth temporarily disabled for testing)
router.put('/:id', categoryUpload.single('image'), updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category by ID
// @access  Admin only (auth temporarily disabled for testing)
router.delete('/:id', deleteCategory);

module.exports = router;
