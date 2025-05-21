const express = require("express")
const router = express.Router()
const authController = require("../controllers/AuthController")
const auth = require("../middleware/Auth") 
const userController = require("../controllers/UserController")
const { hasRole } = require("../middleware/roleAuth")

// Register a new user
router.post("/register", authController.register)

// Login user
router.post("/login", authController.login)

// Get current user
router.get("/me", auth, authController.getCurrentUser)

// Get user profile
router.get("/profile", auth, userController.getUserProfile)

// Update user profile
router.put("/profile", auth, userController.updateUserProfile)

// Get all users (only for pemimpin)
router.get("/users", auth, hasRole("pemimpin"), userController.getAllUsers)

module.exports = router
