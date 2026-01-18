const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [50, 'Coupon code cannot exceed 50 characters']
    },
    discount: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active'
    },
    usageLimit: {
      type: Number,
      min: [0, 'Usage limit cannot be negative']
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative']
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Coupon model
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
