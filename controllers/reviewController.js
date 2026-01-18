const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    const { text, author, role, avatar, rating, productId } = req.body;

    if (!text || !author || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Text, author, and rating are required'
      });
    }

    const review = await Review.create({
      text,
      author,
      role: role || null,
      avatar: avatar || null,
      rating: parseFloat(rating),
      productId: productId || null
    });

    // Update product review count and rating if productId is provided
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        const reviews = await Review.find({ productId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await Product.findByIdAndUpdate(productId, {
          reviewCount: reviews.length,
          rating: Math.round(avgRating * 10) / 10
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const query = productId ? { productId } : {};

    const reviews = await Review.find(query)
      .populate('productId', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('productId', 'name image');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// @desc    Update review by ID
// @route   PUT /api/reviews/:id
// @access  Public
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating if productId exists
    if (review.productId) {
      const reviews = await Review.find({ productId: review.productId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await Product.findByIdAndUpdate(review.productId, {
        reviewCount: reviews.length,
        rating: Math.round(avgRating * 10) / 10
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// @desc    Delete review by ID
// @route   DELETE /api/reviews/:id
// @access  Public
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(req.params.id);

    // Update product review count and rating
    if (productId) {
      const reviews = await Review.find({ productId });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;
      
      await Product.findByIdAndUpdate(productId, {
        reviewCount: reviews.length,
        rating: Math.round(avgRating * 10) / 10
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};
