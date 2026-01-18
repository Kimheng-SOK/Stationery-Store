const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    productImage: {
      type: String,
      required: [true, 'Product image is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerLocation: {
      type: String,
      required: [true, 'Customer location is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    orderDate: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now
    },
    orderTime: {
      type: String,
      trim: true
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required']
    },
    deliveryTime: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'pending', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
