# Quiz Application - AWS Deployment (HW3)

## Project Overview
A full-stack quiz application deployed on AWS using Docker containers, ECR, and ECS with automated CI/CD through CircleCI.

## Architecture
- **Frontend**: React application containerized and hosted on ECS
- **Backend**: Node.js/Express API containerized and hosted on ECS
- **Database**: MongoDB Atlas
- **CI/CD**: CircleCI for automated testing and deployment
- **Container Registry**: Amazon ECR
- **Container Orchestration**: Amazon ECS

## API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token and user details

#### POST /api/users/login
Login existing user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token and user details

### Quiz Endpoints

#### GET /api/quizzes
Get all quizzes
- **Auth**: Not required
- **Response**: Array of quiz objects

#### POST /api/quizzes
Create a new quiz
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "questions": [
      {
        "text": "string",
        "choices": ["string"],
        "rightAnswer": "number",
        "points": "number"
      }
    ]
  }
  ```
- **Response**: Created quiz object

#### GET /api/quizzes/:id
Get a specific quiz
- **Auth**: Not required
- **Response**: Quiz object with questions

### Attempt Endpoints

#### POST /api/attempts/:quizId/answer
Submit an answer for a quiz question
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "questionIndex": "number",
    "selectedAnswer": "number"
  }
  ```
- **Response**: Updated attempt object

#### PUT /api/attempts/:id/complete
Complete a quiz attempt
- **Auth**: Required
- **Response**: Final attempt object with score

#### GET /api/attempts
Get user's quiz attempts
- **Auth**: Required
- **Response**: Array of attempt objects

### User Profile Endpoints

#### GET /api/users/me
Get current user profile
- **Auth**: Required
- **Response**: User object

#### PUT /api/users/me
Update user profile
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "bio": "string"
  }
  ```
- **Response**: Updated user object

### Data Models

#### Quiz Model
```javascript
{
  title: String,
  description: String,
  category: String,
  creator: ObjectId,
  questions: [{
    text: String,
    choices: [String],
    rightAnswer: Number,
    points: Number
  }],
  createdAt: Date
}
```

#### Attempt Model
```javascript
{
  user: ObjectId,
  quiz: ObjectId,
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    points: Number
  }],
  score: Number,
  completed: Boolean,
  startedAt: Date,
  completedAt: Date
}
```

#### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  bio: String,
  quizzesTaken: Number,
  quizzesCreated: Number,
  createdAt: Date
}
```

## Environment Variables
```env
# AWS Configuration
AWS_ACCOUNT_ID=xxxx2510
AWS_DEFAULT_REGION=xxxxst-1
AWS_ECR_BACKEND_REPO=xxxxkend
AWS_ECR_FRONTEND_REPO=xxxxtend
AWS_ECS_CLUSTER=xxxxster
AWS_KEY=xxxxSH2E
AWS_RESOURCE_NAME_PREFIX=xxxx-app
AWS_SECRET_ACCESS_KEY=xxxxfn/l
DOCKER_IMAGE_TAG=xxxxest
```

## Repository Structure
```
├── frontend/                # React frontend application
│   ├── src/                # Source code
│   ├── Dockerfile         # Frontend container configuration
│   └── package.json       # Frontend dependencies
├── controllers/           # Backend API controllers
├── models/               # MongoDB models
├── middleware/           # Express middleware
├── routes/              # API routes
├── __tests__/           # Test files
├── .circleci/           # CircleCI configuration
├── Dockerfile           # Backend container configuration
└── server.js            # Main backend entry point
```

## Setup Instructions

### Prerequisites
- Node.js v14 or higher
- Docker Desktop
- AWS CLI configured
- CircleCI account
- MongoDB Atlas account

### Local Development
1. Clone the repository
```bash
git clone <repository-url>
cd quiz-master
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
cd ..
```

3. Set up environment variables
- Create `.env` file in root directory
- Create `.env` file in frontend directory

4. Run the application
```bash
npm run dev
```

### Docker Build & Push
1. Build images
```bash
# Backend
docker build -t ${AWS_ECR_BACKEND_REPO}:latest .

# Frontend
cd frontend
docker build -t ${AWS_ECR_FRONTEND_REPO}:latest .
```

2. Push to ECR
```bash
# Login to ECR
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com

# Push images
docker push ${AWS_ECR_BACKEND_REPO}:latest
docker push ${AWS_ECR_FRONTEND_REPO}:latest
```

## CI/CD Pipeline

### CircleCI Configuration
The pipeline consists of three main stages:
1. **Test**: Runs backend tests using Jest
2. **Build**: Builds and pushes Docker images to ECR
3. **Deploy**: Updates ECS services with new images

### Environment Variables in CircleCI
Required variables in CircleCI project settings:
- AWS_ACCOUNT_ID
- AWS_DEFAULT_REGION
- AWS_ECR_BACKEND_REPO
- AWS_ECR_FRONTEND_REPO
- AWS_ECS_CLUSTER
- AWS_KEY
- AWS_RESOURCE_NAME_PREFIX
- AWS_SECRET_ACCESS_KEY
- DOCKER_IMAGE_TAG

## Testing
- Backend tests: `npm test`
- Frontend tests: `cd frontend && npm test`

## Deployment

### AWS Services Used
- **ECR**: Container registry for Docker images
- **ECS**: Container orchestration service
- **EC2**: Compute instances for ECS cluster
- **VPC**: Network configuration
- **IAM**: Access management

### Deployment Process
1. Code is pushed to main branch
2. CircleCI pipeline is triggered
3. Tests are run
4. Docker images are built and pushed to ECR
5. ECS services are updated with new images

## Monitoring & Logs
- ECS task logs in CloudWatch
- Application logs in CloudWatch
- Container metrics in CloudWatch

## Troubleshooting
Common issues and solutions:
1. **CircleCI Build Fails**:
   - Check environment variables
   - Verify AWS credentials
   - Check test results

2. **Container Deployment Issues**:
   - Check ECS service events
   - Verify task definition
   - Check container logs

3. **Application Errors**:
   - Check CloudWatch logs
   - Verify environment variables
   - Check MongoDB connection

## Security Considerations
- AWS credentials managed through CircleCI
- Sensitive data in environment variables
- MongoDB Atlas security configuration
- Container security best practices

## Future Improvements
1. Add frontend tests
2. Implement staging environment
3. Add performance monitoring
4. Implement auto-scaling
5. Add backup strategy
<img width="1440" alt="Screenshot 2025-04-08 at 9 09 13 PM" src="https://github.com/user-attachments/assets/cd7e9e1e-6e52-4255-b114-9d235a9bf42f" />

