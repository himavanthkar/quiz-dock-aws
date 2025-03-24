const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User schema - what we need to store
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  avatar: {
    type: String,
    default: 'https://robohash.org/default' // Fun robot avatars as default
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: 'Quiz enthusiast'
  },
  quizzesTaken: {
    type: Number,
    default: 0
  },
  quizzesCreated: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash the password before saving to DB
userSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate salt and hash
  try {
    const salt = await bcrypt.genSalt(10); // 10 rounds is good enough
    this.password = await bcrypt.hash(this.password, salt);
    // console.log('Password hashed successfully');
    next();
  } catch (err) {
    console.error('Password hashing failed:', err);
    next(err);
  }
});

// Sign JWT and return - my custom token creation
userSchema.methods.getSignedToken = function() {
  // I use a different payload format than most tutorials
  return jwt.sign(
    { 
      id: this._id,
      username: this.username,
      role: this.role 
    }, 
    process.env.JWT_SECRET || 'my_super_secret_fallback_key_123', 
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

// Match entered password with stored hashed password
userSchema.methods.checkPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;