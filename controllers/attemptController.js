const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// @desc    Start a new quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private
const startAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    if (!quiz.isPublic && quiz.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to attempt this quiz'
      });
    }
    
    const attempt = await Attempt.create({
      user: req.user.id,
      quiz: quiz._id,
      status: 'started',
      startTime: Date.now()
    });
    
    const attemptQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        text: q.text,
        choices: q.choices,
        points: q.points,
        difficulty: q.difficulty
      }))
    };
    
    if (quiz.shuffleQuestions) {
      attemptQuiz.questions = shuffleArray(attemptQuiz.questions);
    }
    
    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      data: attemptQuiz
    });
  } catch (err) {
    console.error('Start attempt error:', err);
    res.status(500).json({
      success: false,
      message: 'Could not start quiz attempt'
    });
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// @desc    Submit an answer for a quiz attempt
// @route   POST /api/attempts/:id/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    console.log(`Submitting answer for attempt ID: ${req.params.id}`);
    console.log(`Request body:`, JSON.stringify(req.body));
    
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid attempt ID format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid attempt ID format'
      });
    }
    
    const attempt = await Attempt.findById(req.params.id);
    
    if (!attempt) {
      console.error(`Attempt not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    console.log(`Found attempt: ${attempt._id}, status: ${attempt.status}`);
    
    if (attempt.user.toString() !== req.user.id) {
      console.error(`User ${req.user.id} not authorized to access attempt ${attempt._id} owned by ${attempt.user}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit answers to this attempt'
      });
    }
    
    if (attempt.status === 'completed' || attempt.status === 'timed-out') {
      console.error(`Attempt ${attempt._id} already has status: ${attempt.status}`);
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been completed'
      });
    }
    
    const quiz = await Quiz.findById(attempt.quiz);
    
    if (!quiz) {
      console.error(`Quiz not found with ID: ${attempt.quiz}`);
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    console.log(`Found quiz: ${quiz._id}, title: ${quiz.title}`);
    
    const { questionId, selectedChoice, timeTaken } = req.body;
    
    if (!questionId) {
      console.error('Missing questionId in request body');
      return res.status(400).json({
        success: false,
        message: 'Question ID is required'
      });
    }
    
    const question = quiz.questions.id(questionId);
    
    if (!question) {
      console.error(`Question not found with ID: ${questionId} in quiz ${quiz._id}`);
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    console.log(`Found question: ${question._id}, processing answer choice: ${selectedChoice}`);
    
    const isCorrect = selectedChoice === question.rightAnswer;
    
    const pointsEarned = isCorrect ? question.points : 0;
    
    const answer = {
      questionId,
      selectedChoice,
      isCorrect,
      pointsEarned,
      timeTaken: timeTaken || 0
    };
    
    const existingAnswerIndex = attempt.answers.findIndex(
      a => a.questionId.toString() === questionId
    );
    
    if (existingAnswerIndex !== -1) {
      attempt.answers[existingAnswerIndex] = answer;
    } else {
      attempt.answers.push(answer);
    }
    
    attempt.status = 'in-progress';
    
    await attempt.save();
    console.log(`Successfully saved answer for attempt ${attempt._id}`);
    
    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        explanation: question.explanation
      }
    });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Complete a quiz attempt
// @route   PUT /api/attempts/:id/complete
// @access  Private
const completeAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    if (attempt.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to complete this attempt'
      });
    }
    
    if (attempt.status === 'completed' || attempt.status === 'timed-out') {
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been completed'
      });
    }
    
    attempt.status = 'completed';
    attempt.finishTime = Date.now();
    
    await attempt.save();
    
    const updatedAttempt = await Attempt.findById(attempt._id);
    
    res.status(200).json({
      success: true,
      data: updatedAttempt
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get a specific attempt
// @route   GET /api/attempts/:id
// @access  Private
const getAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quiz', 'title description category')
      .populate('user', 'username avatar');
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    if (attempt.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this attempt'
      });
    }
    
    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all attempts for a user
// @route   GET /api/attempts
// @access  Private
const getMyAttempts = async (req, res) => {
  try {
    console.log('Getting attempts for user:', req.user.id);
    
    // Check if user exists
    if (!req.user || !req.user.id) {
      console.error('User not found in request object');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const attempts = await Attempt.find({ user: req.user.id })
      .populate('quiz', 'title description category')
      .sort('-createdAt');
    
    console.log(`Found ${attempts.length} attempts for user ${req.user.id}`);
    
    // Process attempts to ensure all required fields exist
    const processedAttempts = attempts.map(attempt => {
      try {
        // Create a plain JavaScript object from the Mongoose document
        const attemptObj = attempt.toObject ? attempt.toObject() : { ...attempt };
        
        // Ensure quiz exists
        if (!attemptObj.quiz) {
          attemptObj.quiz = { title: 'Unknown Quiz', description: '', category: 'Other' };
        }
        
        // Ensure score exists
        if (attemptObj.score === undefined) {
          attemptObj.score = 0;
        }
        
        // Ensure totalPoints exists
        if (attemptObj.totalPoints === undefined) {
          attemptObj.totalPoints = 0;
        }
        
        // Ensure percentageScore exists
        if (attemptObj.percentageScore === undefined) {
          // Calculate percentage if score and totalPoints exist
          if (attemptObj.totalPoints > 0) {
            attemptObj.percentageScore = (attemptObj.score / attemptObj.totalPoints) * 100;
          } else {
            attemptObj.percentageScore = 0;
          }
        }
        
        // Ensure passed status exists
        if (attemptObj.passed === undefined) {
          attemptObj.passed = false;
        }
        
        // Ensure answers array exists
        if (!attemptObj.answers || !Array.isArray(attemptObj.answers)) {
          attemptObj.answers = [];
        }
        
        // Ensure status exists
        if (!attemptObj.status) {
          attemptObj.status = 'unknown';
        }
        
        return attemptObj;
      } catch (err) {
        console.error('Error processing attempt:', err);
        // Return a default attempt object if processing fails
        return {
          _id: attempt._id || 'unknown',
          quiz: { title: 'Error Processing Quiz', description: '', category: 'Other' },
          score: 0,
          totalPoints: 0,
          percentageScore: 0,
          passed: false,
          answers: [],
          status: 'error',
          startTime: new Date(),
          endTime: new Date()
        };
      }
    });
    
    res.status(200).json({
      success: true,
      count: processedAttempts.length,
      data: processedAttempts
    });
  } catch (err) {
    console.error('Error getting attempts:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  startAttempt,
  submitAnswer,
  completeAttempt,
  getAttempt,
  getMyAttempts
};