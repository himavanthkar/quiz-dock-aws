import React, { createContext, useReducer } from 'react';
import axios from '../utils/index';
import quizReducer from './reducers/quizReducer';

// Initial state
const initialState = {
  quizzes: [],
  quiz: null,
  attempt: null,
  attempts: [],
  loading: true,
  error: null
};

// Create context
export const QuizContext = createContext(initialState);

// Provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Get all quizzes
  const getQuizzes = async (params = {}) => {
    try {
      let queryString = '';
      
      if (Object.keys(params).length > 0) {
        queryString = '?' + new URLSearchParams(params).toString();
      }
      
      const res = await axios.get(`/api/quizzes${queryString}`);

      dispatch({
        type: 'GET_QUIZZES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get single quiz
  const getQuiz = async (id) => {
    try {
      const res = await axios.get(`/api/quizzes/${id}`);

      dispatch({
        type: 'GET_QUIZ',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Create quiz
  const createQuiz = async (formData) => {
    try {
      console.log('Creating quiz with data:', formData);
      
      // Validate required fields
      if (!formData.title) {
        throw new Error('Quiz title is required');
      }
      
      const res = await axios.post('/api/quizzes', formData);
      console.log('Quiz creation response:', res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to create quiz');
      }

      dispatch({
        type: 'CREATE_QUIZ',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      console.error('Error creating quiz:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create quiz';
      
      dispatch({
        type: 'QUIZ_ERROR',
        payload: errorMessage
      });

      return null;
    }
  };

  // Update quiz
  const updateQuiz = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/quizzes/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_QUIZ',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Delete quiz
  const deleteQuiz = async (id) => {
    try {
      console.log(`Attempting to delete quiz with ID: ${id}`);
      
      if (!id) {
        console.error('Delete quiz called with invalid ID');
        dispatch({
          type: 'QUIZ_ERROR',
          payload: 'Invalid quiz ID'
        });
        return false;
      }
      
      const response = await axios.delete(`/api/quizzes/${id}`);
      
      console.log('Delete quiz response:', response.data);

      dispatch({
        type: 'DELETE_QUIZ',
        payload: id
      });
      
      console.log(`Quiz ${id} successfully deleted`);
      return true;
    } catch (err) {
      console.error('Error deleting quiz:', err);
      
      const errorMessage = err.response && err.response.data 
        ? err.response.data.message 
        : 'Failed to delete quiz. Please try again.';
      
      dispatch({
        type: 'QUIZ_ERROR',
        payload: errorMessage
      });

      return false;
    }
  };

  // Add question to quiz
  const addQuestion = async (quizId, questionData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/quizzes/${quizId}/questions`, questionData, config);

      dispatch({
        type: 'UPDATE_QUIZ',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Update question
  const updateQuestion = async (quizId, questionId, questionData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/quizzes/${quizId}/questions/${questionId}`, questionData, config);

      dispatch({
        type: 'UPDATE_QUIZ',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Delete question
  const deleteQuestion = async (quizId, questionId) => {
    try {
      const res = await axios.delete(`/api/quizzes/${quizId}/questions/${questionId}`);

      dispatch({
        type: 'UPDATE_QUIZ',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Start quiz attempt
  const startAttempt = async (quizId) => {
    try {
      console.log(`Starting attempt for quiz: ${quizId}`);
      const res = await axios.post(`/api/quizzes/${quizId}/attempt`);
      
      console.log('Start attempt response:', res.data);
      
      // Store both the quiz data and the attempt ID
      dispatch({
        type: 'START_ATTEMPT',
        payload: {
          ...res.data.data,
          _id: res.data.attemptId // Make sure the attempt ID is included
        }
      });
      
      // Return an object with both the quiz data and attempt ID
      return {
        ...res.data.data,
        _id: res.data.attemptId
      };
    } catch (err) {
      console.error('Error starting attempt:', err);
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response?.data?.message || 'Failed to start quiz attempt'
      });

      return null;
    }
  };

  // Submit answer
  const submitAnswer = async (attemptId, answerData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log(`Submitting answer for attempt: ${attemptId}`, answerData);
      
      if (!attemptId) {
        console.error('Submit answer called with invalid attempt ID');
        dispatch({
          type: 'QUIZ_ERROR',
          payload: 'Invalid attempt ID'
        });
        return null;
      }
      
      const res = await axios.post(`/api/attempts/${attemptId}/answer`, answerData, config);
      console.log('Submit answer response:', res.data);
      
      return res.data.data;
    } catch (err) {
      console.error('Error submitting answer:', err);
      
      const errorMessage = err.response && err.response.data 
        ? err.response.data.message 
        : 'Failed to submit answer. Please try again.';
      
      dispatch({
        type: 'QUIZ_ERROR',
        payload: errorMessage
      });

      return null;
    }
  };

  // Complete attempt
  const completeAttempt = async (attemptId) => {
    try {
      const res = await axios.put(`/api/attempts/${attemptId}/complete`);

      dispatch({
        type: 'COMPLETE_ATTEMPT',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Get attempt
  const getAttempt = async (attemptId) => {
    try {
      const res = await axios.get(`/api/attempts/${attemptId}`);

      dispatch({
        type: 'GET_ATTEMPT',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Get my attempts
  const getMyAttempts = async () => {
    try {
      const res = await axios.get('/api/attempts');

      dispatch({
        type: 'GET_MY_ATTEMPTS',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'QUIZ_ERROR',
        payload: err.response.data.message
      });

      return null;
    }
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes: state.quizzes,
        quiz: state.quiz,
        attempt: state.attempt,
        attempts: state.attempts,
        loading: state.loading,
        error: state.error,
        getQuizzes,
        getQuiz,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        startAttempt,
        submitAnswer,
        completeAttempt,
        getAttempt,
        getMyAttempts,
        clearErrors
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}; 