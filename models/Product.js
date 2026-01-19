const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    sku: {
      type: String,
      required: [true, 'Product SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true // Index for faster SKU searches
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      required: [true, 'Product original price is required'],
      min: [0, 'Original price cannot be negative']
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    },
    isNew: {
      type: Boolean,
      default: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    brand: {
      type: String,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true // Index for faster category-based queries
    },
    addedDate: {
      type: Date,
      default: Date.now
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one product image is required'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
      index: true // Index for filtering by status
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Indexes for better query performance
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.discount) {
    this.price = this.originalPrice * (1 - this.discount / 100);
  }
  next();
});
productSchema.index({ name: 'text', description: 'text' }); // Text search index
productSchema.index({ price: 1 }); // For price sorting
productSchema.index({ stock: 1 }); // For stock sorting
productSchema.index({ rating: -1 }); // For rating sorting
productSchema.index({ createdAt: -1 }); // For date sorting
productSchema.index({ category: 1, status: 1 }); // Compound index for category + status queries

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
