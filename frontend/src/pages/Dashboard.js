import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { QuizContext } from '../context/QuizContext';
import Spinner from '../components/layout/Spinner';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { 
    quizzes, 
    attempts, 
    loading: quizLoading, 
    getQuizzes, 
    getMyAttempts,
    deleteQuiz 
  } = useContext(QuizContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      getQuizzes({ creator: user._id });
      getMyAttempts();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        setError(null); // Clear any previous errors
        const success = await deleteQuiz(id);
        if (success) {
          // Refresh the quizzes list
          getQuizzes({ creator: user?._id });
        } else {
          setError('Failed to delete quiz. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while deleting the quiz.');
        console.error('Delete quiz error:', err);
      }
    }
  };

  if (authLoading || quizLoading) {
    return <Spinner />;
  }

  // Ensure quizzes is an array
  const quizzesArray = Array.isArray(quizzes) ? quizzes : [];
  
  // Ensure attempts is an array
  const attemptsArray = Array.isArray(attempts) ? attempts : [];

  // Filter quizzes created by the user
  const myQuizzes = quizzesArray.filter(quiz => {
    if (!quiz || !user) return false;
    
    return (quiz.creator && quiz.creator._id === user._id) || 
           (typeof quiz.creator === 'string' && quiz.creator === user._id);
  });

  // Calculate stats with null checks
  const totalQuizzesTaken = attemptsArray.length;
  
  const passedQuizzes = attemptsArray.filter(attempt => 
    attempt && attempt.passed
  ).length;
  
  const passRate = totalQuizzesTaken > 0 
    ? Math.round((passedQuizzes / totalQuizzesTaken) * 100) 
    : 0;
  
  // Safely calculate average score with null checks
  let avgScore = 0;
  if (totalQuizzesTaken > 0 && attemptsArray.length > 0) {
    try {
      const totalScore = attemptsArray.reduce((sum, attempt) => {
        // Check if attempt and percentageScore exist
        if (!attempt) return sum;
        const score = attempt.percentageScore || 0;
        return sum + score;
      }, 0);
      avgScore = Math.round(totalScore / totalQuizzesTaken);
    } catch (err) {
      console.error('Error calculating average score:', err);
      avgScore = 0;
    }
  }

  // Safely calculate total questions with null checks
  let totalQuestions = 0;
  if (myQuizzes.length > 0) {
    try {
      totalQuestions = myQuizzes.reduce((sum, quiz) => {
        // Check if quiz and questions exist
        if (!quiz) return sum;
        const questionsCount = quiz.questions ? quiz.questions.length : 0;
        return sum + questionsCount;
      }, 0);
    } catch (err) {
      console.error('Error calculating total questions:', err);
      totalQuestions = 0;
    }
  }

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="my-0">
                <i className="fas fa-user-circle mr-2"></i>
                Wizard Profile
              </h4>
            </div>
            <div className="card-body text-center">
              <img
                src={user?.avatar || `https://robohash.org/${user?._id}?set=set4`}
                alt={user?.username}
                className="rounded-circle mb-3"
                style={{ width: '120px', height: '120px' }}
              />
              <h3>{user?.username}</h3>
              <p className="text-muted">{user?.email}</p>
              <p>{user?.bio || 'No bio provided'}</p>
              <div className="d-flex justify-content-between mt-3">
                <div className="text-center">
                  <h5>{myQuizzes.length}</h5>
                  <small className="text-muted">Quizzes Created</small>
                </div>
                <div className="text-center">
                  <h5>{totalQuizzesTaken}</h5>
                  <small className="text-muted">Quizzes Taken</small>
                </div>
                <div className="text-center">
                  <h5>{passRate}%</h5>
                  <small className="text-muted">Pass Rate</small>
                </div>
              </div>
              <Link to="/profile" className="btn btn-outline-primary mt-3">
                <i className="fas fa-edit mr-1"></i> Edit Profile
              </Link>
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="my-0">
                <i className="fas fa-trophy mr-2"></i>
                Wizard Stats
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center py-3">
                      <h2>{avgScore}%</h2>
                      <small>Average Score</small>
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center py-3">
                      <h2>{passedQuizzes}</h2>
                      <small>Quizzes Passed</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-light">
                    <div className="card-body text-center py-3">
                      <h2>{myQuizzes.length}</h2>
                      <small>Quizzes Created</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-light">
                    <div className="card-body text-center py-3">
                      <h2>{totalQuestions}</h2>
                      <small>Questions Created</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h4 className="my-0">
                <i className="fas fa-scroll mr-2"></i>
                My Quizzes
              </h4>
              <Link to="/quizzes/create" className="btn btn-light btn-sm">
                <i className="fas fa-plus mr-1"></i> Create Quiz
              </Link>
            </div>
            <div className="card-body">
              {myQuizzes.length === 0 ? (
                <div className="alert alert-info">
                  You haven't created any quizzes yet. Click the button above to create your first quiz!
                </div>
              ) : (
                <div className="list-group">
                  {myQuizzes.map(quiz => (
                    <div key={quiz._id} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{quiz.title}</h5>
                        <small className="text-muted">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1">{quiz.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {quiz.questions ? quiz.questions.length : 0} questions | {quiz.attempts || 0} attempts
                        </small>
                        <div>
                          <Link to={`/quizzes/${quiz._id}`} className="btn btn-sm btn-info mr-2">
                            <i className="fas fa-eye"></i> View
                          </Link>
                          <Link to={`/quizzes/edit/${quiz._id}`} className="btn btn-sm btn-warning mr-2">
                            <i className="fas fa-edit"></i> Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteQuiz(quiz._id)} 
                            className="btn btn-sm btn-danger"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h4 className="my-0">
                <i className="fas fa-history mr-2"></i>
                Recent Quiz Attempts
              </h4>
            </div>
            <div className="card-body">
              {attemptsArray.length === 0 ? (
                <div className="alert alert-info">
                  You haven't taken any quizzes yet. <Link to="/quizzes">Browse quizzes</Link> to get started!
                </div>
              ) : (
                <div className="list-group">
                  {attemptsArray.slice(0, 5).map(attempt => (
                    <div key={attempt._id} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{attempt.quiz?.title || 'Unknown Quiz'}</h5>
                        <small className="text-muted">
                          {new Date(attempt.finishTime || attempt.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`badge badge-${attempt.passed ? 'success' : 'danger'} mr-2`}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </span>
                          <span className="badge badge-info">
                            Score: {attempt.percentageScore || 0}%
                          </span>
                        </div>
                        <Link to={`/results/${attempt._id}`} className="btn btn-sm btn-primary">
                          <i className="fas fa-chart-bar"></i> Results
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {attemptsArray.length > 5 && (
                <div className="text-center mt-3">
                  <Link to="/attempts" className="btn btn-outline-warning">
                    View All Attempts
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 