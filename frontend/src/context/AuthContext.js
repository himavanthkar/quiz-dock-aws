import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../utils/index';
import authReducer from './reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    try {
      console.log('Loading user...');
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found in localStorage');
        dispatch({ type: 'AUTH_ERROR', payload: 'No authentication token found' });
        return;
      }

      setAuthToken(token);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`);
      console.log('User loaded successfully:', res.data);
      dispatch({ type: 'USER_LOADED', payload: res.data.data });

    } catch (err) {
      console.error('Error loading user:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        console.log('Token invalid or expired, clearing token');
        localStorage.removeItem('token');
        setAuthToken(null);
      }
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response ? err.response.data.message : 'Authentication error'
      });
    }
  };

  // Register user
  const register = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    try {
      console.log('Registering user:', formData.email);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, formData, config);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      await loadUser();
    } catch (err) {
      console.error('Registration failed:', err);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response ? err.response.data.message : 'Registration failed'
      });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    try {
      console.log('Attempting login with:', formData.email);
      localStorage.removeItem('token');
      setAuthToken(null);
      dispatch({ type: 'LOGIN_START' });

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, formData, config);
      console.log('Login response:', res.data);

      if (!res.data || !res.data.success) throw new Error('Login response missing success status');
      if (!res.data.token) throw new Error('Login response missing token');

      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);

      console.log('Token set in localStorage and axios headers');
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      await loadUser();

    } catch (err) {
      console.error('Login failed:', err);
      localStorage.removeItem('token');
      setAuthToken(null);
      const errorMessage = err.response ? err.response.data.message : err.message || 'Login failed';
      console.error('Final error message:', errorMessage);
      dispatch({ type: 'LOGIN_FAIL', payload: errorMessage });
    }
  };

  // Logout
  const logout = () => {
    console.log('Logging out, clearing token');
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Update profile
  const updateProfile = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/me`, formData, config);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: res.data.data });
    } catch (err) {
      dispatch({
        type: 'UPDATE_PROFILE_FAIL',
        payload: err.response ? err.response.data.message : 'Update profile failed'
      });
    }
  };

  // Change password
  const changePassword = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/password`, formData, config);
      dispatch({ type: 'CHANGE_PASSWORD_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CHANGE_PASSWORD_FAIL',
        payload: err.response ? err.response.data.message : 'Change password failed'
      });
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
