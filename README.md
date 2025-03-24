# Quiz Application HW-2

A full-featured quiz application that allows users to create, share, and take quizzes on various topics.

## Features

- User authentication (register, login, profile management)
- Create and manage quizzes with multiple-choice questions
- Take quizzes and receive immediate feedback on answers
- View quiz results and statistics
- Browse public quizzes by category
- Dashboard to track quiz attempts and created quizzes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd quiz-master
```

2. Install dependencies
```
npm install
cd frontend
npm install
cd ..
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/quizmaster
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Run the application
```
npm run dev
```

This will start both the backend server (port 5001) and the frontend development server (port 3000).

## How to Use the Application

### Creating a Quiz

1. **Register/Login**: Create an account or log in to an existing account.
2. **Access Dashboard**: Navigate to the Dashboard and click on "Create Quiz".
3. **Basic Information**: Fill in the quiz title, description, category, and other settings.
4. **Add Questions**: For each question:
   - Enter the question text
   - Add multiple choice options (2-6 choices)
   - Select which option is the correct answer (this is stored as the index of the correct option)
   - Optionally add an explanation that will be shown after answering
   - Set the point value and difficulty level
5. **Save Quiz**: Click "Save Quiz" to publish your quiz.

### Taking a Quiz

1. **Browse Quizzes**: Go to the "Quizzes" page to see available quizzes.
2. **Start Quiz**: Click on a quiz card and then "Take Quiz" to begin.
3. **Answer Questions**: For each question:
   - Select your answer from the multiple-choice options
   - Click "Next Question" to proceed
   - You'll receive immediate feedback on whether your answer was correct
   - The explanation will be shown if provided by the quiz creator
4. **View Results**: After completing all questions, you'll see your final score and a breakdown of your answers.
5. **Review**: You can review all questions, your answers, and the correct answers on the results page.

### How Correct Answers Work

- When creating a quiz, the creator selects which option is correct for each question.
- This is stored in the database as the `rightAnswer` field, which is the index of the correct option.
- When a user takes a quiz, their selected answer index is compared to the stored `rightAnswer` index.
- If they match, the answer is marked as correct and points are awarded.
- All answers and results are saved in the database for later review.

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile

### Quizzes
- `GET /api/quizzes` - Get all public quizzes
- `GET /api/quizzes/:id` - Get a specific quiz
- `POST /api/quizzes` - Create a new quiz
- `PUT /api/quizzes/:id` - Update a quiz
- `DELETE /api/quizzes/:id` - Delete a quiz

### Questions
- `POST /api/quizzes/:id/questions` - Add a question to a quiz
- `PUT /api/quizzes/:id/questions/:questionId` - Update a question
- `DELETE /api/quizzes/:id/questions/:questionId` - Delete a question

### Attempts
- `POST /api/quizzes/:id/attempt` - Start a new quiz attempt
- `POST /api/attempts/:id/answer` - Submit an answer for a question
- `PUT /api/attempts/:id/complete` - Complete a quiz attempt
- `GET /api/attempts/:id` - Get a specific attempt
- `GET /api/attempts` - Get all attempts for the current user

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Context API
- **Authentication**: JWT, bcrypt
- **Styling**: Bootstrap, CSS

## License

This project is licensed under the MIT License.

## File Structure Overview

### Frontend (`/frontend`)
- **Pages**
  - `Home.js` - Landing page with featured quizzes and categories
  - `Login.js` - User login page
  - `Register.js` - User registration page
  - `Dashboard.js` - User dashboard showing created quizzes and attempts
  - `QuizList.js` - Browse and search all available quizzes
  - `QuizDetails.js` - Detailed view of a single quiz
  - `TakeQuiz.js` - Interface for taking a quiz
  - `QuizResults.js` - Shows results after completing a quiz
  - `CreateQuiz.js` - Form for creating new quizzes
  - `EditQuiz.js` - Form for editing existing quizzes
  - `Profile.js` - User profile management

- **Components**
  - `/layout`
    - `Navbar.js` - Top navigation bar
    - `Footer.js` - Site footer
    - `Spinner.js` - Loading animation
    - `Alert.js` - Error/success messages
  - `/routing`
    - `PrivateRoute.js` - Route protection for authenticated users

- **Context**
  - `AuthContext.js` - Authentication state management
  - `QuizContext.js` - Quiz data and operations management
  - `/reducers`
    - `authReducer.js` - Authentication state updates
    - `quizReducer.js` - Quiz state updates

### Backend (Root Directory)
- **Server**
  - `server.js` - Main Express server setup
  - `.env` - Environment variables configuration

- **API Routes**
  - `/routes`
    - `userRoutes.js` - User authentication endpoints
    - `quizRoutes.js` - Quiz CRUD operations
    - `attemptRoutes.js` - Quiz attempt handling

- **Controllers**
  - `/controllers`
    - `userController.js` - User-related logic
    - `quizController.js` - Quiz management logic
    - `attemptController.js` - Quiz attempt logic

- **Models**
  - `/models`
    - `User.js` - User data schema
    - `Quiz.js` - Quiz data schema
    - `Attempt.js` - Quiz attempt data schema

- **Middleware**
  - `/middleware`
    - `auth.js` - Authentication middleware
    - `error.js` - Error handling middleware

### Utility Files
- `/utils`
  - `setAuthToken.js` - Axios authentication header setup
  - `index.js` - Common utility functions

### Testing and Documentation
- `test-login.html` - Test page for authentication
- `test-api.js` - API testing utilities
- `postman_documentation.md` - API endpoint documentation
- `errors-encountered.txt` - Common issues and solutions

### Scripts
- `setup.sh` - Initial setup script
- `run-app.sh` - Application startup script
- `restart.sh` - Application restart script

