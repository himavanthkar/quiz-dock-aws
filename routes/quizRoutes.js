const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getFeaturedQuizzes
} = require('../controllers/quizController');
const { startAttempt } = require('../controllers/attemptController');
const { protect, isQuizOwner } = require('../middleware/auth');

// Public routes
router.get('/', getQuizzes);
router.get('/featured', getFeaturedQuizzes);
router.get('/:id', getQuiz);

// Protected routes
router.post('/', protect, createQuiz);
router.put('/:id', protect, isQuizOwner, updateQuiz);
router.delete('/:id', protect, isQuizOwner, deleteQuiz);

// Question routes
router.post('/:id/questions', protect, isQuizOwner, addQuestion);
router.put('/:id/questions/:questionId', protect, isQuizOwner, updateQuestion);
router.delete('/:id/questions/:questionId', protect, isQuizOwner, deleteQuestion);

// Attempt routes
router.post('/:id/attempt', protect, startAttempt);

module.exports = router;