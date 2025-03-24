import React from 'react';
import { Link } from 'react-router-dom';

// 404 Not Found page with Harry Potter theme
const NotFound = () => {
  // Just a fun quote for the 404 page
  const quotes = [
    "I solemnly swear that I am up to no good... but I can't find this page!",
    "Mischief managed... but this page seems to have disappeared!",
    "Not even the Marauder's Map can find this page!",
    "Looks like this page has vanished like a spell gone wrong!"
  ];
  
  // Pick a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto text-center">
          {/* Main card */}
          <div className="card shadow-lg border-0">
            <div className="card-body py-5">
              {/* 404 header */}
              <h1 className="display-1 mb-4">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              
              {/* Wizard image */}
              <div className="mb-4">
                <img 
                  src="https://i.imgur.com/7PfGYG8.png" 
                  alt="Confused Wizard" 
                  className="img-fluid" 
                  style={{ maxHeight: '200px' }}
                />
              </div>
              
              {/* Message */}
              <p className="lead mb-4">
                Hmm, it seems this page has vanished like a spell gone wrong!
              </p>
              
              {/* Quote box */}
              <div className="alert alert-warning">
                <p className="mb-0">
                  <i className="fas fa-quote-left mr-2"></i>
                  <em>
                    {randomQuote}
                  </em>
                  <i className="fas fa-quote-right ml-2"></i>
                </p>
              </div>
              
              {/* Navigation buttons */}
              <div className="mt-4">
                <Link to="/" className="btn btn-primary btn-lg mr-3">
                  <i className="fas fa-home mr-2"></i>
                  Return to Hogwarts
                </Link>
                
                <Link to="/quizzes" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-magic mr-2"></i>
                  Explore Quizzes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 