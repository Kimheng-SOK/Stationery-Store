const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      productName,
      productImage,
      quantity,
      customerName,
      customerLocation,
      amount,
      orderDate,
      orderTime,
      deliveryDate,
      deliveryTime,
      status
    } = req.body;

    if (!orderNumber || !productName || !quantity || !customerName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order number, product name, quantity, customer name, and amount are required'
      });
    }

    const order = await Order.create({
      orderNumber: orderNumber.toUpperCase(),
      productName,
      productImage: productImage || null,
      quantity: parseInt(quantity),
      customerName,
      customerLocation: customerLocation || '',
      amount: parseFloat(amount),
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      orderTime: orderTime || null,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
      deliveryTime: deliveryTime || null,
      status: status || 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// @desc    Update order by ID
// @route   PUT /api/orders/:id
// @access  Public
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// @desc    Delete order by ID
// @route   DELETE /api/orders/:id
// @access  Public
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
