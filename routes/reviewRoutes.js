const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public
router.post('/', createReview);

// @route   GET /api/reviews
// @desc    Get all reviews (optionally filtered by productId)
// @access  Public
router.get('/', getAllReviews);

// @route   GET /api/reviews/:id
// @desc    Get single review by ID
// @access  Public
router.get('/:id', getReviewById);

// @route   PUT /api/reviews/:id
// @desc    Update review by ID
// @access  Public
router.put('/:id', updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review by ID
// @access  Public
router.delete('/:id', deleteReview);

module.exports = router;
