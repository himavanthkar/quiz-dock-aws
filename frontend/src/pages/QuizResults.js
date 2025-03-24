import React, { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import Spinner from '../components/layout/Spinner';

const QuizResults = () => {
  const { id } = useParams();
  const { attempt, loading, getAttempt } = useContext(QuizContext);

  useEffect(() => {
    getAttempt(id);
    // eslint-disable-next-line
  }, [id]);

  if (loading || !attempt) {
    return <Spinner />;
  }

  const { quiz, answers, totalScore, percentageScore, passed, totalTimeTaken } = attempt;

  // Format time taken
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
  };

  // Get feedback message based on score
  const getFeedbackMessage = () => {
    if (percentageScore >= 90) {
      return {
        message: 'Outstanding! You have the knowledge of a true wizard!',
        icon: 'fa-hat-wizard',
        color: 'text-success'
      };
    } else if (percentageScore >= 80) {
      return {
        message: 'Excellent work! Professor McGonagall would be proud!',
        icon: 'fa-graduation-cap',
        color: 'text-success'
      };
    } else if (percentageScore >= quiz.passingScore) {
      return {
        message: 'Good job! You passed the quiz!',
        icon: 'fa-award',
        color: 'text-success'
      };
    } else if (percentageScore >= quiz.passingScore - 10) {
      return {
        message: 'So close! A bit more studying and you\'ll pass next time!',
        icon: 'fa-book',
        color: 'text-warning'
      };
    } else {
      return {
        message: 'Keep practicing your spells! You\'ll get better with time.',
        icon: 'fa-wand-magic-sparkles',
        color: 'text-danger'
      };
    }
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="container mt-4">
      <div className="card shadow-lg mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Quiz Results: {quiz.title}</h2>
        </div>
        <div className="card-body">
          <div className="text-center mb-4">
            <div className={`display-1 ${passed ? 'text-success' : 'text-danger'} mb-3`}>
              <i className={`fas ${passed ? 'fa-trophy' : 'fa-times-circle'}`}></i>
            </div>
            <h3 className={passed ? 'text-success' : 'text-danger'}>
              {passed ? 'Congratulations! You Passed!' : 'Quiz Failed'}
            </h3>
            <p className="lead">
              Your Score: <strong>{percentageScore}%</strong> ({totalScore} points)
            </p>
            <p>
              Passing Score: <strong>{quiz.passingScore}%</strong>
            </p>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fas fa-info-circle mr-2"></i>
                    Quiz Summary
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Category:</span>
                      <span className="badge badge-primary">{quiz.category}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total Questions:</span>
                      <span>{answers.length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Correct Answers:</span>
                      <span className="text-success">
                        {answers.filter(a => a.isCorrect).length}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Incorrect Answers:</span>
                      <span className="text-danger">
                        {answers.filter(a => !a.isCorrect).length}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Time Taken:</span>
                      <span>{formatTime(totalTimeTaken)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <div className="text-center">
                    <i className={`fas ${feedback.icon} fa-3x ${feedback.color} mb-3`}></i>
                    <h5 className="card-title">Feedback</h5>
                    <p className="card-text">{feedback.message}</p>
                    <div className="mt-3">
                      <Link to={`/quizzes/${quiz._id}`} className="btn btn-outline-primary mr-2">
                        <i className="fas fa-redo mr-1"></i> Try Again
                      </Link>
                      <Link to="/quizzes" className="btn btn-outline-secondary">
                        <i className="fas fa-search mr-1"></i> Find More Quizzes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h4 className="mb-3">
            <i className="fas fa-list-ol mr-2"></i>
            Question Details
          </h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Correct Answer</th>
                  <th>Points</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((answer, index) => {
                  // Add null checks to prevent errors
                  if (!quiz || !quiz.questions) {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Question data unavailable</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{answer.pointsEarned || 0}</td>
                        <td>
                          {answer.isCorrect ? (
                            <span className="badge badge-success">Correct</span>
                          ) : (
                            <span className="badge badge-danger">Incorrect</span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                  
                  const question = quiz.questions.find(q => q._id === answer.questionId);
                  
                  // Handle case where question is not found
                  if (!question) {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Question not found</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{answer.pointsEarned || 0}</td>
                        <td>
                          {answer.isCorrect ? (
                            <span className="badge badge-success">Correct</span>
                          ) : (
                            <span className="badge badge-danger">Incorrect</span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                  
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{question.text}</td>
                      <td>{question.choices && question.choices[answer.selectedChoice] || '-'}</td>
                      <td>{question.choices && question.choices[question.rightAnswer] || '-'}</td>
                      <td>{answer.pointsEarned} / {question.points}</td>
                      <td>
                        {answer.isCorrect ? (
                          <span className="badge badge-success">Correct</span>
                        ) : (
                          <span className="badge badge-danger">Incorrect</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <Link to="/dashboard" className="btn btn-outline-secondary">
              <i className="fas fa-tachometer-alt mr-1"></i> Back to Dashboard
            </Link>
            <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary">
              <i className="fas fa-redo mr-1"></i> Take Quiz Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 