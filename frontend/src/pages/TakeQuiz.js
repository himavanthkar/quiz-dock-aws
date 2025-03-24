import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import Spinner from '../components/layout/Spinner';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quiz, attempt, loading, getQuiz, submitAnswer, completeAttempt } = useContext(QuizContext);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  
  useEffect(() => {
    getQuiz(id);
    // eslint-disable-next-line
  }, [id]);
  
  useEffect(() => {
    if (quiz && quiz.timeLimit && quiz.timeLimit > 0) {
      const totalSeconds = quiz.timeLimit * 60;
      setTimeLeft(totalSeconds);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line
  }, [quiz]);
  
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleOptionSelect = optionIndex => {
    if (feedback || isSubmitting) {
      return;
    }
    setSelectedOption(optionIndex);
  };
  
  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('Please select an answer before proceeding.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate time taken for this question
      const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      console.log('Current attempt:', attempt);
      
      if (!attempt || !attempt._id) {
        console.error('No valid attempt found. Attempt:', attempt);
        alert('Error: No valid quiz attempt found. Please try starting the quiz again.');
        setIsSubmitting(false);
        return;
      }
      
      if (!quiz || !quiz.questions || !quiz.questions[currentQuestion]) {
        console.error('No valid question found. Quiz:', quiz, 'Current question index:', currentQuestion);
        alert('Error: Question data is missing. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      const questionId = quiz.questions[currentQuestion]._id;
      console.log(`Submitting answer for question ${questionId}, choice: ${selectedOption}, attempt: ${attempt._id}`);
      
      // Submit answer
      const result = await submitAnswer(attempt._id, {
        questionId: questionId,
        selectedChoice: selectedOption,
        timeTaken
      });
      
      if (!result) {
        console.error('Failed to submit answer - no result returned');
        alert('Failed to submit your answer. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Answer submission result:', result);
      
      // Save answer to state
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionId: questionId,
        selectedChoice: selectedOption,
        isCorrect: result.isCorrect,
        pointsEarned: result.pointsEarned,
        explanation: result.explanation
      };
      setAnswers(newAnswers);
      
      // Show feedback
      setFeedback(result);
      
      // Reset for next question
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        setIsSubmitting(false);
        
        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          startTimeRef.current = Date.now();
        } else {
          handleQuizComplete();
        }
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error submitting answer:', err);
      alert('An error occurred while submitting your answer. Please try again.');
    }
  };
  
  const handleQuizComplete = async () => {
    try {
      console.log(`Completing attempt: ${attempt._id}`);
      
      if (!attempt || !attempt._id) {
        console.error('No valid attempt found for completion');
        alert('Error: Could not complete the quiz. Missing attempt data.');
        return;
      }
      
      const result = await completeAttempt(attempt._id);
      
      if (!result) {
        console.error('Failed to complete attempt - no result returned');
        alert('Failed to complete the quiz. Please try again.');
        return;
      }
      
      console.log('Quiz completed successfully:', result);
      navigate(`/results/${attempt._id}`);
    } catch (err) {
      console.error('Error completing quiz:', err);
      alert('An error occurred while completing the quiz. Please try again.');
    }
  };
  
  if (loading || !quiz) {
    return <Spinner />;
  }
  
  const question = quiz.questions[currentQuestion];
  
  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">{quiz.title}</h3>
            {timeLeft !== null && (
              <div className="badge badge-light p-2">
                <i className="fas fa-clock mr-1"></i>
                Time Left: {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="progress mb-4">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              aria-valuenow={currentQuestion + 1}
              aria-valuemin="0"
              aria-valuemax={quiz.questions.length}
            >
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>
          
          <div className="question-container">
            <h4 className="mb-4">
              <span className="badge badge-secondary mr-2">Q{currentQuestion + 1}</span>
              {question.text}
            </h4>
            
            <div className="options-container">
              {question.choices.map((option, index) => (
                <div
                  key={index}
                  className={`card mb-2 option-card ${
                    selectedOption === index ? 'border-primary' : ''
                  } ${
                    feedback && selectedOption === index
                      ? feedback.isCorrect
                        ? 'border-success'
                        : 'border-danger'
                      : ''
                  } ${
                    (feedback || isSubmitting) ? 'disabled-option' : ''
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  style={{ 
                    cursor: (feedback || isSubmitting) ? 'not-allowed' : 'pointer',
                    opacity: (feedback || isSubmitting) && selectedOption !== index ? 0.7 : 1
                  }}
                >
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div
                        className={`option-indicator mr-3 ${
                          selectedOption === index ? 'bg-primary' : 'bg-light'
                        } ${
                          feedback && selectedOption === index
                            ? feedback.isCorrect
                              ? 'bg-success'
                              : 'bg-danger'
                            : ''
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="option-text">{option}</div>
                      {feedback && feedback.isCorrect && question.rightAnswer === index && selectedOption !== index && (
                        <div className="ml-auto">
                          <span className="badge badge-success">
                            <i className="fas fa-check"></i> Correct Answer
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {feedback && (
              <div
                className={`alert ${
                  feedback.isCorrect ? 'alert-success' : 'alert-danger'
                } mt-3`}
              >
                <h5>
                  <i
                    className={`fas ${
                      feedback.isCorrect ? 'fa-check-circle' : 'fa-times-circle'
                    } mr-2`}
                  ></i>
                  {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                </h5>
                {feedback.explanation && <p>{feedback.explanation}</p>}
                <p>
                  Points earned: <strong>{feedback.pointsEarned}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div>
            <span className="text-muted">
              {question.difficulty === 'easy' && (
                <span className="badge badge-success mr-2">Easy</span>
              )}
              {question.difficulty === 'medium' && (
                <span className="badge badge-warning mr-2">Medium</span>
              )}
              {question.difficulty === 'hard' && (
                <span className="badge badge-danger mr-2">Hard</span>
              )}
              Points: {question.points}
            </span>
          </div>
          <div>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                  </>
                ) : (
                  <>
                    Next Question <i className="fas fa-arrow-right ml-1"></i>
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                  </>
                ) : (
                  <>
                    Finish Quiz <i className="fas fa-flag-checkered ml-1"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-body">
          <h5>
            <i className="fas fa-info-circle mr-2"></i>
            Quiz Information
          </h5>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Category
                  <span className="badge badge-primary badge-pill">{quiz.category}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Questions
                  <span className="badge badge-primary badge-pill">{quiz.questions.length}</span>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Passing Score
                  <span className="badge badge-primary badge-pill">{quiz.passingScore}%</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Time Limit
                  <span className="badge badge-primary badge-pill">
                    {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz; 