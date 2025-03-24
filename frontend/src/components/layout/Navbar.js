import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaHome, FaScroll, FaPlusCircle, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaUserCircle, FaFootballBall, FaBaseballBall, FaHatWizard } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          <FaUserCircle className="me-1" /> Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/quizzes">
          <FaScroll className="me-1" /> Quizzes
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/quizzes/create">
          <FaPlusCircle className="me-1" /> Create Quiz
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">
          <FaUserCircle className="me-1" /> Profile
        </Link>
      </li>
      <li className="nav-item">
        <a href="#!" className="nav-link" onClick={onLogout}>
          <FaSignOutAlt className="me-1" /> Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" to="/quizzes">
          <FaScroll className="me-1" /> Quizzes
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          <FaUserPlus className="me-1" /> Register
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          <FaSignInAlt className="me-1" /> Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex">
            <FaHatWizard className="me-2" />
            <FaFootballBall className="me-2" />
            <FaBaseballBall className="me-2" />
          </div>
          Magical Quizzes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>
          </ul>
          <div className="ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
          {isAuthenticated && user && (
            <span className="navbar-text ms-3">
              Welcome, {user.username}
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="rounded-circle ms-2"
                  style={{ width: '30px' }}
                />
              )}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 