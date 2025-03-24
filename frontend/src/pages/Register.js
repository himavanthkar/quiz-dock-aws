import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const { username, email, password, password2 } = formData;
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
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

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    
    if (password !== password2) {
      alert('Passwords do not match');
    } else {
      register({
        username,
        email,
        password
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white text-center">
              <h3>
                <i className="fas fa-user-plus mr-2"></i>
                Register for Hogwarts
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Wizard Name</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={username}
                      onChange={onChange}
                      placeholder="Choose your wizard name"
                      required
                      minLength="3"
                    />
                  </div>
                  <small className="form-text text-muted">
                    Choose a name that other wizards will know you by
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Owl Post Address</label>
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
                      placeholder="Where should we send your Hogwarts letter?"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Secret Spell (Password)</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Create a secret spell"
                      required
                      minLength="6"
                    />
                  </div>
                  <small className="form-text text-muted">
                    Your spell must be at least 6 characters long
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="password2">Confirm Secret Spell</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password2"
                      name="password2"
                      value={password2}
                      onChange={onChange}
                      placeholder="Confirm your secret spell"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success btn-block">
                  <i className="fas fa-broom mr-2"></i>
                  Join the Wizarding World
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p className="mb-0">
                Already have a Hogwarts account?{' '}
                <Link to="/login" className="text-success">
                  Return to Hogwarts
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 