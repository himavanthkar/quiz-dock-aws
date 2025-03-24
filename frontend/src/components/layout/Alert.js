import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { QuizContext } from '../../context/QuizContext';

const Alert = () => {
  const { error: authError, clearErrors: clearAuthErrors } = useContext(AuthContext);
  const { error: quizError, clearErrors: clearQuizErrors } = useContext(QuizContext);

  const error = authError || quizError;

  if (!error) {
    return null;
  }

  const handleClose = () => {
    if (authError) clearAuthErrors();
    if (quizError) clearQuizErrors();
  };

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="fas fa-exclamation-circle mr-2"></i>
      {error}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={handleClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Alert; 