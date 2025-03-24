const mongoose = require('mongoose');

// Individual answers in an attempt
const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedChoice: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timeTaken: { // Time taken in seconds
    type: Number,
    default: 0
  }
});

// Quiz attempt schema
const AttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [AnswerSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  percentageScore: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['started', 'in-progress', 'completed', 'timed-out'],
    default: 'started'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  finishTime: {
    type: Date
  },
  totalTimeTaken: { // In seconds
    type: Number
  },
  feedback: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate stats when attempt is completed
AttemptSchema.pre('save', async function(next) {
  if (this.status === 'completed' && this.isModified('status')) {
    try {
      // Find the corresponding quiz
      const quiz = await mongoose.model('Quiz').findById(this.quiz);
      
      if (!quiz) {
        return next(new Error('Quiz not found'));
      }
      
      // Calculate finish time and total time taken
      this.finishTime = new Date();
      this.totalTimeTaken = Math.round((this.finishTime - this.startTime) / 1000);
      
      // Calculate total score
      this.totalScore = this.answers.reduce((total, answer) => total + answer.pointsEarned, 0);
      
      // Calculate percentage score
      const maxPossibleScore = quiz.totalPoints || quiz.questions.reduce((total, q) => total + q.points, 0);
      this.percentageScore = Math.round((this.totalScore / maxPossibleScore) * 100);
      
      // Determine if passed
      this.passed = this.percentageScore >= quiz.passingScore;
      
      // Update quiz stats
      await mongoose.model('Quiz').findByIdAndUpdate(this.quiz, {
        $inc: { attempts: 1 },
        $set: { avgScore: (quiz.avgScore * quiz.attempts + this.percentageScore) / (quiz.attempts + 1) }
      });
      
      // Update user stats
      await mongoose.model('User').findByIdAndUpdate(this.user, {
        $inc: { quizzesTaken: 1 }
      });
    } catch (err) {
      console.error('Error finalizing attempt:', err);
    }
  }
  next();
});

const Attempt = mongoose.model('Attempt', AttemptSchema);
module.exports = Attempt;