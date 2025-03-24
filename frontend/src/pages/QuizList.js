import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import Spinner from '../components/layout/Spinner';

const QuizList = () => {
  const { quizzes, loading, pagination, getQuizzes } = useContext(QuizContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getQuizzes({ page, limit: 9, category: category || undefined });
    // eslint-disable-next-line
  }, [page, category]);

  const onSearch = e => {
    e.preventDefault();
    getQuizzes({ 
      page: 1, 
      limit: 9, 
      category: category || undefined,
      title: searchTerm ? { $regex: searchTerm, $options: 'i' } : undefined
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setPage(1);
    getQuizzes({ page: 1, limit: 9 });
  };

  const categories = [
    { value: 'general', label: 'General Knowledge' },
    { value: 'history', label: 'Wizarding History' },
    { value: 'spells', label: 'Spells & Charms' },
    { value: 'potions', label: 'Potions' },
    { value: 'creatures', label: 'Magical Creatures' },
    { value: 'characters', label: 'Characters' },
    { value: 'places', label: 'Magical Places' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="container mt-4">
      <div className="jumbotron bg-primary text-white">
        <div className="container">
          <h1 className="display-4">
            <i className="fas fa-scroll mr-3"></i>
            Magical Quizzes
          </h1>
          <p className="lead">
            Browse our collection of wizarding quizzes and test your magical knowledge
          </p>
          <form onSubmit={onSearch} className="mt-4">
            <div className="row">
              <div className="col-md-6 mb-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for quizzes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <select
                  className="form-control"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <button type="submit" className="btn btn-light btn-block">
                  Search
                </button>
              </div>
            </div>
            <div className="text-right">
              <button
                type="button"
                className="btn btn-link text-white"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : quizzes.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle mr-2"></i>
          No quizzes found. Try adjusting your search criteria.
        </div>
      ) : (
        <>
          <div className="row">
            {quizzes.map(quiz => (
              <div className="col-md-4 mb-4" key={quiz._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{quiz.title}</h5>
                  </div>
                  <img
                    src={quiz.quizImage || `https://picsum.photos/seed/${quiz._id}/300/150`}
                    alt={quiz.title}
                    className="card-img-top"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <p className="card-text">{quiz.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge badge-pill badge-info mr-2">
                          {quiz.category}
                        </span>
                        <small className="text-muted">
                          {quiz.questions.length} questions
                        </small>
                      </div>
                      <small className="text-muted">
                        {quiz.attempts || 0} attempts
                      </small>
                    </div>
                  </div>
                  <div className="card-footer bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        By {quiz.creator.username}
                      </small>
                      <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary">
                        View Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="d-flex justify-content-center mt-4 mb-5">
              <nav>
                <ul className="pagination">
                  {pagination.prev && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                    </li>
                  )}
                  <li className="page-item active">
                    <span className="page-link">{page}</span>
                  </li>
                  {pagination.next && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList; 