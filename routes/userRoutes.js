const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  getUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - these need to come BEFORE the /:id route
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// This route should come AFTER the /me routes
router.get('/:id', getUserProfile);

module.exports = router;