const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  try {
    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    // Basic token validation
    if (typeof token !== 'string' || token.length < 10) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_fallback_key_123');
      
      if (!decoded || !decoded.id) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token payload'
        });
      }

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found with the provided token'
        });
      }

      // Set user in request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Token validation failed: ' + jwtError.message
      });
    }
  } catch (err) {
    console.error('Authentication Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please log in first' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};

// Check if user is quiz owner
const isQuizOwner = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is quiz owner or admin
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to modify this quiz'
      });
    }

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { protect, authorize, isQuizOwner };