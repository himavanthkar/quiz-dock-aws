import axios from './index';

const setAuthToken = token => {
  try {
    if (token) {
      // Basic validation to ensure token is a string and has a reasonable format
      if (typeof token !== 'string') {
        console.error('Invalid token format (not a string):', typeof token);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return;
      }
      
      // Check if token has a reasonable length and format
      if (token.length < 20 || !token.includes('.')) {
        console.error('Invalid token format (too short or missing parts):', token.substring(0, 10) + '...');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return;
      }
      
      console.log('Setting auth token:', token.substring(0, 15) + '...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      console.log('Removing auth token');
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error('Error in setAuthToken:', error);
    // Ensure headers are clean in case of error
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken; 