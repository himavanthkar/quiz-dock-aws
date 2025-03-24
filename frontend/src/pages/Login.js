import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;
  const { login, isAuthenticated, loading, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Clear any previous errors
    clearErrors();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Add this useEffect to debug errors
  useEffect(() => {
    if (error) {
      console.log('Login error:', error);
      setIsSubmitting(false);
    }
  }, [error]);

  // Reset submitting state when loading changes
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting login with:', { email, password });
    
    // Basic validation
    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    
    login({ email, password });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>
                <i className="fas fa-wand-sparkles mr-2"></i>
                Login to Hogwarts
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Enter your owl post address"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-key"></i>
                      </span>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Enter your secret spell"
                      required
                    />
                    <div className="input-group-append">
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={toggleShowPassword}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Login
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary">
                  Register
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Demo Accounts</h5>
              </div>
              <div className="card-body">
                <p><strong>Harry Potter:</strong> harry@hogwarts.edu / gryffindor123</p>
                <p><strong>Test User:</strong> test@example.com / password123</p>
                <button 
                  className="btn btn-sm btn-info mr-2"
                  onClick={() => {
                    setFormData({
                      email: 'harry@hogwarts.edu',
                      password: 'gryffindor123'
                    });
                  }}
                >
                  Use Harry's Credentials
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setFormData({
                      email: 'test@example.com',
                      password: 'password123'
                    });
                  }}
                >
                  Use Test User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 