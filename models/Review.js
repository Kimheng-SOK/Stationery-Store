const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters']
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    role: {
      type: String,
      trim: true,
      maxlength: [50, 'Role cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null // Optional: link to product if it's a product review
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
