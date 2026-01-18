const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      maxlength: [100, 'Team member name cannot exceed 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Team member role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters']
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the TeamMember model
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
