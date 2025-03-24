const mongoose = require('mongoose');

// Question schema - embedded in quiz
const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a question text'],
    trim: true
  },
  // My personal preference for storing options - more readable
  choices: {
    type: [String],
    required: [true, 'Please provide answer choices'],
    validate: {
      validator: function(choices) {
        return choices.length >= 2 && choices.length <= 6; // Min 2, max 6 choices
      },
      message: 'A question must have between 2 and 6 answer options'
    }
  },
  rightAnswer: {
    type: Number, // Index of correct answer in choices array
    required: [true, 'Please specify which answer is correct'],
    min: 0, 
    validate: {
      validator: function(val) {
        return val < this.choices.length;
      },
      message: 'Correct answer index must be less than number of choices'
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 10, // I like giving 10 points per question
    min: [1, 'Points must be at least 1'],
    max: [100, 'Points cannot exceed 100']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

// Quiz schema
const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'general', 'science', 'history', 'geography', 
      'movies', 'music', 'sports', 'technology', 'other'
    ],
    default: 'general'
  },
  tags: [String],
  questions: [QuestionSchema],
  timeLimit: { // Time limit in minutes
    type: Number,
    default: 0 // 0 means no time limit
  },
  quizImage: {
    type: String,
    default: 'https://picsum.photos/seed/quiz/200/200' // Random image from Lorem Picsum
  },
  isPublic: {
    type: Boolean,
    default: true // Make quizzes public by default
  },
  passingScore: { // Percentage needed to pass
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  attempts: {
    type: Number,
    default: 0 // Track how many times quiz has been taken
  },
  avgScore: {
    type: Number,
    default: 0 // Average score of all attempts
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  featuredStatus: {
    type: Boolean,
    default: false // Admin can feature good quizzes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field - total points possible
QuizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Virtual field - question count
QuizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Pre-save hook - update the creator's quizzesCreated count
QuizSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Update user's quizzesCreated count
      await mongoose.model('User').findByIdAndUpdate(
        this.creator, 
        { $inc: { quizzesCreated: 1 } }
      );
    } catch (err) {
      console.error('Failed to update user quiz count:', err);
    }
  }
  next();
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;