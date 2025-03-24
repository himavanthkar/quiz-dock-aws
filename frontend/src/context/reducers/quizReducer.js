const quizReducer = (state, action) => {
  switch (action.type) {
    case 'GET_QUIZZES':
      return {
        ...state,
        quizzes: action.payload.data,
        pagination: action.payload.pagination,
        loading: false
      };
    case 'GET_QUIZ':
      return {
        ...state,
        quiz: action.payload,
        loading: false
      };
    case 'CREATE_QUIZ':
      return {
        ...state,
        quizzes: [action.payload, ...state.quizzes],
        quiz: action.payload,
        loading: false
      };
    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz._id === action.payload._id ? action.payload : quiz
        ),
        quiz: action.payload,
        loading: false
      };
    case 'DELETE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz._id !== action.payload),
        loading: false
      };
    case 'START_ATTEMPT':
      return {
        ...state,
        attempt: action.payload,
        loading: false
      };
    case 'COMPLETE_ATTEMPT':
      return {
        ...state,
        attempt: action.payload,
        loading: false
      };
    case 'GET_ATTEMPT':
      return {
        ...state,
        attempt: action.payload,
        loading: false
      };
    case 'GET_MY_ATTEMPTS':
      return {
        ...state,
        attempts: action.payload,
        loading: false
      };
    case 'QUIZ_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default quizReducer; 