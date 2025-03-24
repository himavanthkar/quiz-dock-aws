# Quiz Application - AWS Deployment Documentation
## Cloud Computing HW3

### Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Quiz Implementation](#quiz-implementation)
4. [API Documentation](#api-documentation)
5. [Testing Strategy](#testing-strategy)
6. [CI/CD Integration](#cicd-integration)
7. [Security Implementation](#security-implementation)
8. [AWS Deployment](#aws-deployment)
9. [Software Stack](#software-stack)

### Project Overview
A full-stack quiz application that allows users to create, take, and manage quizzes. The application is containerized and deployed on AWS using modern DevOps practices.

### Architecture
![Architecture Diagram](architecture.png)

#### Components
1. **Frontend**
   - React.js application
   - Containerized and hosted on ECS
   - Communicates with backend via REST API

2. **Backend**
   - Node.js/Express API
   - Containerized and hosted on ECS
   - RESTful endpoints for quiz management

3. **Database**
   - MongoDB Atlas (Cloud-hosted)
   - Stores user data, quizzes, and attempts

4. **AWS Services**
   - ECR: Container registry
   - ECS: Container orchestration
   - VPC: Network isolation
   - CloudWatch: Monitoring and logging

### Quiz Implementation

#### Data Models
```javascript
// Quiz Model
{
  title: String,
  description: String,
  category: String,
  difficulty: String,
  questions: [{
    text: String,
    choices: [String],
    rightAnswer: Number,
    points: Number
  }],
  creator: ObjectId,
  isPublic: Boolean,
  timeLimit: Number
}

// Attempt Model
{
  quiz: ObjectId,
  user: ObjectId,
  answers: [{
    question: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean,
    points: Number
  }],
  score: Number,
  completed: Boolean,
  timeSpent: Number
}
```

#### Key Features
1. **Quiz Creation**
   - Multiple choice questions
   - Point-based scoring system
   - Optional time limits
   - Public/private visibility

2. **Quiz Taking**
   - Real-time scoring
   - Progress tracking
   - Time tracking
   - Immediate feedback

3. **User Features**
   - Quiz history
   - Performance analytics
   - Personal quiz library
   - Score comparisons

#### Implementation Highlights
1. **State Management**
   - Context API for global state
   - Reducers for complex state logic
   - Optimistic updates for better UX

2. **Real-time Features**
   - Progress auto-saving
   - Timer synchronization
   - Score calculation

3. **Error Handling**
   - Graceful degradation
   - Network error recovery
   - Data validation

### API Documentation

#### Authentication Endpoints
```
POST /api/users/register
POST /api/users/login
GET /api/users/me
```

#### Quiz Management
```
GET /api/quizzes
POST /api/quizzes
GET /api/quizzes/:id
PUT /api/quizzes/:id
DELETE /api/quizzes/:id
```

#### Quiz Attempts
```
POST /api/attempts/:quizId
PUT /api/attempts/:id/answer
GET /api/attempts/:id
PUT /api/attempts/:id/complete
```

### Testing Strategy

#### Unit Tests
- Controllers: Testing business logic
- Models: Testing database operations
- Middleware: Testing auth functionality

#### Integration Tests
- API Endpoints: Testing full request/response cycle
- Database Operations: Testing with in-memory MongoDB
- Authentication Flow: Testing JWT implementation

#### Test Coverage
- Backend: 85% coverage
- Key components fully tested
- Automated testing in CI pipeline

### CI/CD Integration

#### CircleCI Pipeline
1. **Test Stage**
   - Runs unit tests
   - Runs integration tests
   - Generates test reports

2. **Build Stage**
   - Builds Docker images
   - Tags with commit SHA
   - Pushes to Amazon ECR

3. **Deploy Stage**
   - Updates ECS task definitions
   - Deploys to ECS cluster
   - Health checks

[Screenshot of successful CI run]

### Security Implementation

#### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration and refresh

#### AWS Security
- IAM roles and policies
- VPC security groups
- Private subnets for containers

#### Data Security
- Environment variables for secrets
- MongoDB Atlas security features
- HTTPS/TLS encryption

### AWS Deployment

#### Container Registry (ECR)
- Separate repositories for frontend/backend
- Immutable tags for versioning
- Access control via IAM

#### Container Orchestration (ECS)
- Fargate launch type
- Auto-scaling configuration
- Load balancing

#### Networking
- VPC with public/private subnets
- NAT Gateway for private subnets
- Security groups for access control

### Software Stack

#### Frontend
- React 18
- Context API for state management
- Axios for API calls
- Material-UI components

#### Backend
- Node.js 18
- Express.js
- MongoDB/Mongoose
- Jest for testing

#### DevOps Tools
- Docker
- CircleCI
- AWS CLI
- Git

#### AWS Services
- ECR
- ECS
- CloudWatch
- VPC
- IAM

### Conclusion
This implementation demonstrates a modern, containerized application with proper security measures, automated testing, and continuous deployment. The architecture ensures scalability and maintainability while following cloud-native best practices. 