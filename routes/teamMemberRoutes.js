const express = require('express');
const router = express.Router();
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamMemberController');

// @route   POST /api/team-members
// @desc    Create a new team member
// @access  Public
router.post('/', createTeamMember);

// @route   GET /api/team-members
// @desc    Get all team members
// @access  Public
router.get('/', getAllTeamMembers);

// @route   GET /api/team-members/:id
// @desc    Get single team member by ID
// @access  Public
router.get('/:id', getTeamMemberById);

// @route   PUT /api/team-members/:id
// @desc    Update team member by ID
// @access  Public
router.put('/:id', updateTeamMember);

// @route   DELETE /api/team-members/:id
// @desc    Delete team member by ID
// @access  Public
router.delete('/:id', deleteTeamMember);

module.exports = router;
