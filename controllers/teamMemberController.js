const TeamMember = require('../models/TeamMember');

// @desc    Create a new team member
// @route   POST /api/team-members
// @access  Public
const createTeamMember = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name and role are required'
      });
    }

    const teamMember = await TeamMember.create({ name, role });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create team member',
      error: error.message
    });
  }
};

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
};

// @desc    Get single team member by ID
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member',
      error: error.message
    });
  }
};

// @desc    Update team member by ID
// @route   PUT /api/team-members/:id
// @access  Public
const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
};

// @desc    Delete team member by ID
// @route   DELETE /api/team-members/:id
// @access  Public
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
      error: error.message
    });
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
};
