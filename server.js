const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const colors = require('colors'); // added for some colored console logs
const morgan = require('morgan'); // logging requests

// Load env vars
dotenv.config();

// Import route files
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://34.210.25.120:3000', 'http://localhost:3000'], // Allow both EC2 and local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);

// Quick home route to check if API is running
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Quiz API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://himavanthkar:Hatrik123456%24@cluster0.hrv1x.mongodb.net/quizmaster?retryWrites=true&w=majority');
    console.log(`Database connected successfully`.cyan.underline.bold);
    return conn;
  } catch (err) {
    console.error(`Error connecting to database: ${err.message}`.red);
    process.exit(1);
  }
};

// Only connect to the database if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`.yellow.bold);
    console.log(`Go to http://localhost:${PORT}`.blue);
  });
}

module.exports = { app, connectDB };
