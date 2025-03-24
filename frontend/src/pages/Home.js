import React from 'react';
import { Link } from 'react-router-dom';
import { FaHatWizard, FaFootballBall, FaBaseballBall, FaBrain } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="jumbotron text-center bg-dark text-white py-5">
        <div className="container">
          <h1 className="display-4 d-flex align-items-center justify-content-center">
            <div className="d-flex me-3">
              <FaHatWizard className="me-2" />
              <FaFootballBall className="me-2" />
              <FaBaseballBall className="me-2" />
            </div>
            Welcome to Magical Quizzes
          </h1>
          <p className="lead">
            Create, take, and share engaging quizzes on your favorite topics!
          </p>
          <hr className="my-4" />
          <div className="mb-4">
            <h5 className="text-light mb-3">🌟 What you can do:</h5>
            <ul className="text-light text-start">
              <li>Create your own magical quizzes with multiple-choice questions</li>
              <li>Update and manage your quizzes anytime</li>
              <li>Take quizzes created by other wizards</li>
              <li>Track your progress and view detailed results</li>
            </ul>
            <p className="mt-3">
              <strong>Please register or login to start your magical journey!</strong>
            </p>
          </div>
          <Link to="/quizzes" className="btn btn-primary btn-lg me-3">
            Browse Quizzes
          </Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">
            Join Now
          </Link>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="container-fluid py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Popular Categories</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card text-white bg-warning h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">Harry Potter</h3>
                  <FaHatWizard className="fa-4x my-3" />
                  <p className="card-text">
                    Test your knowledge of the wizarding world with our magical quizzes!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-white bg-success h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">Cricket</h3>
                  <FaBaseballBall className="fa-4x my-3" />
                  <p className="card-text">
                    From IPL to World Cup, challenge yourself with cricket trivia!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-white bg-danger h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">Football</h3>
                  <FaFootballBall className="fa-4x my-3" />
                  <p className="card-text">
                    Premier League, La Liga, World Cup - prove your football knowledge!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-white bg-primary h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">General Knowledge</h3>
                  <FaBrain className="fa-4x my-3" />
                  <p className="card-text">
                    History, science, geography and more - test your general knowledge!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container my-5 text-center">
        <h2>Ready to test your knowledge?</h2>
        <p className="lead">
          Create an account to take quizzes, track your progress, and create your own challenging quizzes!
        </p>
        <div className="mt-4">
          <Link to="/register" className="btn btn-primary btn-lg me-3">
            Sign Up Now
          </Link>
          <Link to="/quizzes/create" className="btn btn-success btn-lg">
            Create a Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 