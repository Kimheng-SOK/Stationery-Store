const Checkout = require('../models/Checkout');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

// @desc    Create a new checkout/order
// @route   POST /api/checkout
// @access  Public
const createCheckout = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      cartItems,
      couponCode
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !street || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'All customer and shipping information is required'
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required'
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of cartItems) {
      if (!item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each cart item must have price and quantity'
        });
      }
      subtotal += item.price * item.quantity;
    }

    // Calculate shipping (free if subtotal > 50)
    const shipping = subtotal > 50 ? 0 : 5.00;

    // Apply coupon if provided
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon && coupon.status === 'active') {
        // Check if coupon is expired
        if (coupon.endDate && new Date() > coupon.endDate) {
          await Coupon.findByIdAndUpdate(coupon._id, { status: 'expired' });
        } else if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          discount = (subtotal * coupon.discount) / 100;
          appliedCoupon = coupon;
          
          // Increment used count
          await Coupon.findByIdAndUpdate(coupon._id, {
            $inc: { usedCount: 1 }
          });
        }
      }
    }

    const total = subtotal + shipping - discount;

    // Create checkout order
    const checkout = await Checkout.create({
      email,
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      cartItems,
      subtotal,
      shipping,
      discount,
      total,
      couponCode: appliedCoupon ? couponCode.toUpperCase() : null,
      status: 'pending'
    });

    // Update product stock
    for (const item of cartItems) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: checkout
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to process checkout',
      error: error.message
    });
  }
};

// @desc    Get all checkout orders
// @route   GET /api/checkout
// @access  Public
const getAllCheckouts = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const checkouts = await Checkout.find(query)
      .populate('cartItems.productId', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: checkouts.length,
      data: checkouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checkout orders',
      error: error.message
    });
  }
};

// @desc    Get single checkout by ID
// @route   GET /api/checkout/:id
// @access  Public
const getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id)
      .populate('cartItems.productId', 'name image price');

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: 'Checkout order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: checkout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checkout order',
      error: error.message
    });
  }
};

// @desc    Get checkout by order number
// @route   GET /api/checkout/order/:orderNumber
// @access  Public
const getCheckoutByOrderNumber = async (req, res) => {
  try {
    const checkout = await Checkout.findOne({ orderNumber: req.params.orderNumber })
      .populate('cartItems.productId', 'name image price');

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: checkout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// @desc    Update checkout status by ID
// @route   PUT /api/checkout/:id
// @access  Public
const updateCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: 'Checkout order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Checkout order updated successfully',
      data: checkout
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update checkout order',
      error: error.message
    });
  }
};

// @desc    Delete checkout by ID
// @route   DELETE /api/checkout/:id
// @access  Public
const deleteCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: 'Checkout order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Checkout order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete checkout order',
      error: error.message
    });
  }
};

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  getCheckoutByOrderNumber,
  updateCheckout,
  deleteCheckout
};
