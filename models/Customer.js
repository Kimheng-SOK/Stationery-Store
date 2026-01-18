const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    memberSince: {
      type: Date,
      required: [true, 'Member since date is required'],
      default: Date.now
    },
    purchasedItems: {
      type: Number,
      default: 0,
      min: [0, 'Purchased items cannot be negative']
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: [0, 'Reward points cannot be negative']
    },
    avatar: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
