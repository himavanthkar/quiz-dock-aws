const express = require('express');
const router = express.Router();
const {
  submitAnswer,
  completeAttempt,
  getAttempt,
  getMyAttempts
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getMyAttempts);
router.get('/:id', getAttempt);
router.post('/:id/answer', submitAnswer);
router.put('/:id/complete', completeAttempt);

module.exports = router;