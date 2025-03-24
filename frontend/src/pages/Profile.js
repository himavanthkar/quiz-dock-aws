import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { QuizContext } from '../context/QuizContext';
import Spinner from '../components/layout/Spinner';

// Main profile component
const Profile = () => {
  // Get auth and quiz context data/functions
  const { user, loading: authLoading, updateProfile } = useContext(AuthContext);
  const { getUserQuizzes, loading: quizLoading } = useContext(QuizContext);
  
  // Form data for profile editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    house: '',
    avatarUrl: ''
  });
  
  // State for user's quizzes and UI state
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Set form data from user object
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        house: user.house || 'gryffindor',
        avatarUrl: user.avatarUrl || ''
      });
      
      // Function to load user's quizzes
      const loadUserQuizzes = async () => {
        const quizzes = await getUserQuizzes();
        
        if (quizzes) {
          setUserQuizzes(quizzes);
        }
        
        setIsLoaded(true);
      };
      
      // Call the function
      loadUserQuizzes();
    }
  }, [user, getUserQuizzes]);
  
  // Destructure form data for easier access
  const { name, email, bio, house, avatarUrl } = formData;
  
  // Handle form field changes
  const onChange = e => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  
  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    
    // Update profile and exit edit mode
    await updateProfile(formData);
    setIsEditing(false);
  };
  
  // Get Bootstrap color class based on house
  const getHouseColor = house => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return 'danger';
      case 'slytherin':
        return 'success';
      case 'ravenclaw':
        return 'primary';
      case 'hufflepuff':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  // Create a badge for the user's house
  const getHouseBadge = house => {
    return (
      <span className={`badge badge-${getHouseColor(house)} mr-2`}>
        {house.charAt(0).toUpperCase() + house.slice(1)}
      </span>
    );
  };
  
  // Show loading spinner while data is being fetched
  if (authLoading || quizLoading || !isLoaded) {
    return <Spinner />;
  }
  
  // Render the component
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column - Profile Info */}
        <div className="col-md-4">
          {/* Profile Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-user-circle mr-2"></i>
                Profile
              </h3>
            </div>
            
            {/* Show edit form or profile info based on state */}
            {isEditing ? (
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  
                  {/* Email Field (disabled) */}
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                      disabled
                    />
                    <small className="form-text text-muted">
                      Email cannot be changed
                    </small>
                  </div>
                  
                  {/* Bio Field */}
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      value={bio}
                      onChange={onChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                  
                  {/* Hogwarts House Selection */}
                  <div className="form-group">
                    <label htmlFor="house">Hogwarts House</label>
                    <select
                      className="form-control"
                      id="house"
                      name="house"
                      value={house}
                      onChange={onChange}
                    >
                      <option value="gryffindor">Gryffindor</option>
                      <option value="slytherin">Slytherin</option>
                      <option value="ravenclaw">Ravenclaw</option>
                      <option value="hufflepuff">Hufflepuff</option>
                    </select>
                  </div>
                  
                  {/* Avatar URL Field */}
                  <div className="form-group">
                    <label htmlFor="avatarUrl">Avatar URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="avatarUrl"
                      name="avatarUrl"
                      value={avatarUrl}
                      onChange={onChange}
                      placeholder="Enter URL for your avatar image"
                    />
                    <small className="form-text text-muted">
                      Leave blank for default avatar
                    </small>
                  </div>
                  
                  {/* Form Buttons */}
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card-body text-center">
                {/* Profile Avatar */}
                <div className="mb-3">
                  <img
                    src={
                      avatarUrl ||
                      `https://ui-avatars.com/api/?name=${name}&background=${
                        getHouseColor(house) === 'danger'
                          ? 'B71C1C'
                          : getHouseColor(house) === 'success'
                          ? '1B5E20'
                          : getHouseColor(house) === 'primary'
                          ? '0D47A1'
                          : 'F57F17'
                      }&color=fff&size=128`
                    }
                    alt={name}
                    className="rounded-circle img-fluid profile-avatar"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                
                {/* User Info */}
                <h4 className="card-title">{name}</h4>
                <p className="card-text">
                  {getHouseBadge(house)}
                  <span className="text-muted">{email}</span>
                </p>
                
                {/* Bio (if exists) */}
                {bio && <p className="card-text">{bio}</p>}
                
                {/* Edit Button */}
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit mr-1"></i> Edit Profile
                </button>
              </div>
            )}
          </div>
          
          {/* Stats Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">
                <i className="fas fa-trophy mr-2"></i>
                Stats
              </h4>
            </div>
            <div className="card-body">
              <div className="row text-center">
                {/* Quizzes Created */}
                <div className="col-6 mb-3">
                  <h5>{userQuizzes.length}</h5>
                  <small className="text-muted">Quizzes Created</small>
                </div>
                
                {/* Quizzes Taken */}
                <div className="col-6 mb-3">
                  <h5>{user.quizzesTaken || 0}</h5>
                  <small className="text-muted">Quizzes Taken</small>
                </div>
                
                {/* Total Score */}
                <div className="col-6">
                  <h5>{user.totalScore || 0}</h5>
                  <small className="text-muted">Total Score</small>
                </div>
                
                {/* Average Score */}
                <div className="col-6">
                  <h5>{user.averageScore ? user.averageScore.toFixed(1) + '%' : '0%'}</h5>
                  <small className="text-muted">Average Score</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Quizzes & Activity */}
        <div className="col-md-8">
          {/* My Quizzes Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">
                <i className="fas fa-magic mr-2"></i>
                My Quizzes
              </h3>
            </div>
            <div className="card-body">
              {/* Show message if no quizzes */}
              {userQuizzes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="lead mb-3">You haven't created any quizzes yet!</p>
                  <Link to="/create-quiz" className="btn btn-primary">
                    <i className="fas fa-plus-circle mr-1"></i> Create Your First Quiz
                  </Link>
                </div>
              ) : (
                <div className="list-group">
                  {/* Map through user's quizzes */}
                  {userQuizzes.map(quiz => (
                    <div key={quiz._id} className="list-group-item list-group-item-action">
                      {/* Quiz Title and Date */}
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <h5 className="mb-1">{quiz.title}</h5>
                        <small>
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      
                      {/* Quiz Description */}
                      <p className="mb-1">{quiz.description}</p>
                      
                      {/* Quiz Stats and Actions */}
                      <div className="d-flex justify-content-between align-items-center">
                        <small>
                          <span className="badge badge-primary mr-2">
                            {quiz.category}
                          </span>
                          <span className="badge badge-secondary mr-2">
                            {quiz.questions.length} questions
                          </span>
                          <span className="badge badge-info">
                            {quiz.attempts || 0} attempts
                          </span>
                        </small>
                        <div>
                          {/* View Button */}
                          <Link
                            to={`/quizzes/${quiz._id}`}
                            className="btn btn-sm btn-outline-primary mr-2"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          
                          {/* Edit Button */}
                          <Link
                            to={`/edit-quiz/${quiz._id}`}
                            className="btn btn-sm btn-outline-success"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Create New Quiz Button (only if user has quizzes) */}
            {userQuizzes.length > 0 && (
              <div className="card-footer">
                <Link to="/create-quiz" className="btn btn-success">
                  <i className="fas fa-plus-circle mr-1"></i> Create New Quiz
                </Link>
              </div>
            )}
          </div>
          
          {/* Recent Activity Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">
                <i className="fas fa-history mr-2"></i>
                Recent Activity
              </h3>
            </div>
            <div className="card-body">
              {/* Show timeline if activity exists */}
              {user.recentActivity && user.recentActivity.length > 0 ? (
                <div className="timeline">
                  {/* Map through activity items */}
                  {user.recentActivity.map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-item-content">
                        {/* Activity Type Badge */}
                        <span className="tag" style={{ background: activity.type === 'quiz_taken' ? '#3498db' : '#2ecc71' }}>
                          {activity.type === 'quiz_taken' ? 'Quiz Taken' : 'Quiz Created'}
                        </span>
                        
                        {/* Activity Date */}
                        <time>{new Date(activity.date).toLocaleDateString()}</time>
                        
                        {/* Activity Description */}
                        <p>{activity.description}</p>
                        
                        {/* Link to Quiz (if available) */}
                        {activity.quizId && (
                          <Link to={`/quizzes/${activity.quizId}`}>
                            View Quiz
                          </Link>
                        )}
                        
                        {/* Timeline Circle */}
                        <span className="circle"></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No recent activity to show.</p>
                  <Link to="/quizzes" className="btn btn-primary">
                    <i className="fas fa-search mr-1"></i> Browse Quizzes
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

export default Profile; 