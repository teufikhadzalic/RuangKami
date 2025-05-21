const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body

    // Find user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update basic info
    if (name) user.name = name

    // Check if email is being changed
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } })
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" })
      }

      user.email = email
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    await user.save()

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select("-password")

    res.json(updatedUser)
  } catch (error) {
    console.error("Update user profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all users (only for pemimpin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
