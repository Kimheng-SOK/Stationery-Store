const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
      index: true // Index for faster searches
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
      type: String,
      default: null // Filename of the uploaded image
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null // null for top-level categories
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true // Index for filtering active categories
    },
    order: {
      type: Number,
      default: 0 // For custom ordering
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for getting children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Index for parent field for faster queries
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, parent: 1 });

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
