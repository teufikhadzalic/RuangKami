const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auth = require('../middleware/Auth');
const { hasRole } = require('../middleware/roleAuth');

// Get user profile
router.get('/profile', auth, userController.getUserProfile);

// Update user profile
router.put('/profile', auth, userController.updateUserProfile);

// Get all users (only for pemimpin)
router.get('/users', auth, hasRole('pemimpin'), userController.getAllUsers);

module.exports = router;