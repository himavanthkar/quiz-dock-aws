# Quiz Application Security Implementation

## 1. Authentication & Authorization

### JWT Implementation
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };
```

### Password Hashing
```javascript
// models/User.js
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

## 2. AWS Security Configuration

### IAM Roles
```yaml
# ECS Task Execution Role
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

### Security Groups
```yaml
# Application Load Balancer Security Group
Ingress:
  - Port: 80
    Protocol: TCP
    Source: 0.0.0.0/0
  - Port: 443
    Protocol: TCP
    Source: 0.0.0.0/0

# ECS Container Security Group
Ingress:
  - Port: 3000
    Protocol: TCP
    Source: ALB-SecurityGroup
  - Port: 5001
    Protocol: TCP
    Source: ALB-SecurityGroup
```

## 3. API Security

### Input Validation
```javascript
// controllers/quizController.js
const createQuiz = async (req, res) => {
  try {
    // Validate input
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid quiz data' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.text || !question.options || !question.correctAnswer) {
        return res.status(400).json({ message: 'Invalid question format' });
      }
    }

    // Create quiz
    const quiz = await Quiz.create({
      title,
      questions,
      user: req.user.id
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Protected Routes
```javascript
// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicQuizzes);

// Protected routes
router.use(protect); // All routes below this will be protected
router.post('/', createQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
```

## 4. Frontend Security

### Token Management
```javascript
// frontend/src/utils/setAuthToken.js
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};
```

### Protected Routes
```javascript
// frontend/src/components/routing/PrivateRoute.js
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## 5. Database Security

### MongoDB Connection
```javascript
// config/db.js
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  authSource: 'admin',
  retryWrites: true
});
```

### Schema Validation
```javascript
// models/Quiz.js
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    text: {
      type: String,
      required: [true, 'Please add a question']
    },
    options: {
      type: [String],
      required: [true, 'Please add options'],
      validate: [arr => arr.length >= 2, 'At least 2 options required']
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify correct answer']
    }
  }]
});
``` 