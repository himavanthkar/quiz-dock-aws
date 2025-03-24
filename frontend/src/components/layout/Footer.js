import React from 'react';
import { Link } from 'react-router-dom';
import { FaHatWizard, FaFootballBall, FaBaseballBall } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-info">Magical Quizzes</h5>
            <p className="text-light">
              Welcome to our enchanting quiz platform! Create and share your own magical quizzes, 
              challenge your friends, and explore a world of knowledge. Join our community of 
              curious minds and let the learning adventure begin!
            </p>
          </div>
          <div className="col-md-3">
            <h5 className="text-info">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light hover-info">Home</Link></li>
              <li><Link to="/quizzes" className="text-light hover-info">Browse Quizzes</Link></li>
              <li><Link to="/register" className="text-light hover-info">Join Us</Link></li>
              <li><Link to="/login" className="text-light hover-info">Sign In</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="text-info">Popular Categories</h5>
            <ul className="list-unstyled">
              <li><FaHatWizard className="me-2 text-purple" /><span className="text-warning">Magical Knowledge</span></li>
              <li><FaBaseballBall className="me-2 text-teal" /><span className="text-success">Sports & Games</span></li>
              <li><FaFootballBall className="me-2 text-orange" /><span className="text-danger">Team Sports</span></li>
              <li><span className="text-info">Science & Nature</span></li>
            </ul>
          </div>
        </div>
        <hr className="border-info" />
        <div className="text-center">
          <p>
            <small className="text-info">
              "Curiosity is the spark that ignites the flame of knowledge!"
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 