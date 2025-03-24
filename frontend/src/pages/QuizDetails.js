import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/layout/Spinner';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quiz, loading, getQuiz, startAttempt, deleteQuiz } = useContext(QuizContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuiz(id);
    // eslint-disable-next-line
  }, [id]);

  const onStartQuiz = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      console.log(`Starting quiz attempt for quiz: ${id}`);
      const attempt = await startAttempt(id);
      
      if (!attempt) {
        console.error('Failed to start quiz attempt - no data returned');
        setError('Failed to start quiz. Please try again.');
        return;
      }
      
      console.log('Quiz attempt started successfully:', attempt);
      
      if (!attempt._id) {
        console.error('No attempt ID returned from startAttempt');
        setError('Failed to start quiz: Missing attempt ID');
        return;
      }
      
      navigate(`/quizzes/${id}/take`);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError('An error occurred while starting the quiz. Please try again.');
    }
  };

  const onDeleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        const success = await deleteQuiz(id);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to delete quiz. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while deleting the quiz.');
        console.error('Delete quiz error:', err);
      }
    }
  };

  if (loading || !quiz) {
    return <Spinner />;
  }

  // Check if the current user is the owner of the quiz
  const isOwner = isAuthenticated && user && quiz.creator && 
                 (quiz.creator._id === user._id || 
                  (typeof quiz.creator === 'string' && quiz.creator === user._id));

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">{quiz.title}</h2>
            </div>
            <img
              src={quiz.quizImage || `https://picsum.photos/seed/${quiz._id}/800/400`}
              alt={quiz.title}
              className="img-fluid"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h4 className="card-title">Description</h4>
              <p className="card-text">{quiz.description}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5>
                    <i className="fas fa-info-circle mr-2"></i>
                    Quiz Details
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Category
                      <span className="badge badge-primary badge-pill">{quiz.category}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Questions
                      <span className="badge badge-primary badge-pill">{quiz.questions.length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Time Limit
                      <span className="badge badge-primary badge-pill">
                        {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Passing Score
                      <span className="badge badge-primary badge-pill">{quiz.passingScore}%</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>
                    <i className="fas fa-chart-bar mr-2"></i>
                    Quiz Statistics
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Total Attempts
                      <span className="badge badge-info badge-pill">{quiz.attempts || 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Average Score
                      <span className="badge badge-info badge-pill">{quiz.avgScore || 0}%</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Created By
                      <span>{quiz.creator.username || 'Unknown'}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Created On
                      <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <Link to="/quizzes" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left mr-1"></i> Back to Quizzes
                </Link>
                <div>
                  {isOwner && (
                    <>
                      <Link to={`/quizzes/edit/${quiz._id}`} className="btn btn-warning mr-2">
                        <i className="fas fa-edit mr-1"></i> Edit Quiz
                      </Link>
                      <button onClick={onDeleteQuiz} className="btn btn-danger mr-2">
                        <i className="fas fa-trash-alt mr-1"></i> Delete Quiz
                      </button>
                    </>
                  )}
                  <button onClick={onStartQuiz} className="btn btn-primary">
                    <i className="fas fa-play mr-1"></i> Start Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          {/* Quiz Preview */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">
                <i className="fas fa-eye mr-2"></i>
                Quiz Preview
              </h4>
            </div>
            <div className="card-body">
              <p>This quiz contains {quiz.questions.length} questions on {quiz.category}.</p>
              
              {quiz.questions.length > 0 && (
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Sample Question</h5>
                    <p className="card-text">{quiz.questions[0].text}</p>
                    <ul className="list-group">
                      {quiz.questions[0].choices.map((choice, index) => (
                        <li key={index} className="list-group-item">
                          {choice}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-muted">
                      <small>* Actual answers will be revealed after you complete the quiz</small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="alert alert-warning">
                <i className="fas fa-info-circle mr-2"></i>
                You need to score at least {quiz.passingScore}% to pass this quiz.
              </div>
            </div>
          </div>
          
          {/* Owner Actions */}
          {isOwner && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="fas fa-cog mr-2"></i>
                  Quiz Management
                </h4>
              </div>
              <div className="card-body">
                <p>As the creator of this quiz, you can edit or delete it.</p>
                <div className="d-grid gap-2">
                  <Link to={`/quizzes/edit/${quiz._id}`} className="btn btn-warning mb-2">
                    <i className="fas fa-edit mr-1"></i> Edit Quiz
                  </Link>
                  <button onClick={onDeleteQuiz} className="btn btn-danger">
                    <i className="fas fa-trash-alt mr-1"></i> Delete Quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetails; 