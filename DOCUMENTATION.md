# Quiz Application Documentation

## Software Stack
- **Frontend**:
  - React.js
  - Context API for state management
  - Axios for API calls
  - React Router for navigation
  - Modern UI/UX with responsive design

- **Backend**:
  - Node.js
  - Express.js framework
  - MongoDB for database
  - JWT for authentication
  - RESTful API architecture

- **DevOps & Cloud**:
  - Docker for containerization
  - CircleCI for CI/CD pipeline
  - AWS Services:
    - ECR (Elastic Container Registry) for container images
    - ECS (Elastic Container Service) with Fargate for serverless container management
    - VPC for networking
    - IAM for security and access control

## Security Implementation
1. **Authentication & Authorization**:
   - JWT (JSON Web Tokens) for secure authentication
   - Protected API routes using middleware
   - Token expiration and refresh mechanism
   - Password hashing using bcrypt

2. **AWS Security**:
   - IAM roles and policies for service access
   - VPC security groups for network isolation
   - Private subnets for container deployment
   - AWS Secrets Management for sensitive data

3. **Application Security**:
   - Input validation and sanitization
   - CORS configuration
   - Rate limiting
   - Secure HTTP headers

## CI/CD Pipeline
Our CircleCI pipeline implements both Continuous Integration and Continuous Deployment:

1. **Continuous Integration**:
   - Automated testing on every push
   - Code quality checks
   - Build verification
   - Docker image building

2. **Continuous Deployment**:
   - Automatic deployment to AWS ECS
   - Zero-downtime deployments
   - Environment-specific configurations
   - Automated rollbacks on failure

Pipeline Steps:
1. Code checkout
2. Install dependencies
3. Run tests
4. Build Docker images
5. Push to Amazon ECR
6. Deploy to ECS Fargate

## AWS Architecture
Our application runs on AWS using a modern, containerized architecture:

```
[Frontend Container]     [Backend Container]
        ↓                       ↓
    (Fargate Tasks)
        ↓
[Amazon ECS Cluster]
        ↓
[VPC with public/private subnets]
        ↓
[Security Groups & IAM Roles]
```

### AWS Services Used:
1. **ECS (Elastic Container Service)**:
   - Manages container orchestration
   - Handles scaling and availability
   - Uses Fargate for serverless container management

2. **Fargate**:
   - Serverless compute engine for containers
   - No EC2 instance management required
   - Auto-scaling capabilities

3. **ECR (Elastic Container Registry)**:
   - Stores Docker images
   - Integrated with ECS
   - Secure and private registry

## API Documentation

### Authentication Endpoints
- `POST /api/users/register`: Create new user account
- `POST /api/users/login`: User login
- `GET /api/users/me`: Get current user profile

### Quiz Endpoints
- `POST /api/quizzes`: Create new quiz
- `GET /api/quizzes`: List all quizzes
- `GET /api/quizzes/:id`: Get specific quiz
- `PUT /api/quizzes/:id`: Update quiz
- `DELETE /api/quizzes/:id`: Delete quiz

### Attempt Endpoints
- `POST /api/attempts/:quizId`: Start quiz attempt
- `PUT /api/attempts/:id/answer`: Submit answer
- `PUT /api/attempts/:id/complete`: Complete attempt
- `GET /api/attempts`: Get user's attempts

## Testing
The application includes several types of tests:

1. **Unit Tests**:
   - Controller functions
   - Model methods
   - Utility functions

2. **Integration Tests**:
   - API endpoints
   - Database operations
   - Authentication flow

3. **End-to-End Tests**:
   - User flows
   - Quiz creation and submission
   - Authentication process

## Required Screenshots
1. CircleCI Pipeline Success
2. AWS ECS Cluster
3. ECR Repositories
4. Successful Deployments
5. Test Results

## Repository Structure
```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   └── Dockerfile
├── .circleci/
│   └── config.yml
└── README.md
```

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Set up environment variables
4. Run locally:
   ```bash
   npm run dev
   cd frontend && npm start
   ```

## Deployment Process
1. Push to GitHub
2. CircleCI automatically:
   - Builds the application
   - Runs tests
   - Creates Docker images
   - Pushes to ECR
   - Deploys to ECS

## Future Improvements
1. Implement caching layer
2. Add monitoring and logging
3. Set up auto-scaling policies
4. Implement CDN for static assets
5. Add performance monitoring 