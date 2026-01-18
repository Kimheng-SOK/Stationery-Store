const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', isAuthenticated, logout);

// @route   GET /api/auth/me
// @desc    Get current user session
// @access  Private
router.get('/me', isAuthenticated, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', isAuthenticated, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', isAuthenticated, changePassword);

module.exports = router;
