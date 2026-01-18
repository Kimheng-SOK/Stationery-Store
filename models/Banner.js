const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    requestedDate: {
      type: Date,
      required: [true, 'Requested date is required'],
      default: Date.now
    },
    image: {
      type: String,
      required: [true, 'Banner image is required']
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Days must be at least 1']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    link: {
      type: String,
      required: [true, 'Banner link is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'expired'],
      default: 'pending'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Banner model
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
