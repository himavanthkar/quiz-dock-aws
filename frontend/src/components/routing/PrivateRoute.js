import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user, loadUser } = useContext(AuthContext);

  useEffect(() => {
    console.log('PrivateRoute - Auth State:', { isAuthenticated, loading, user });
    
    // If we have a token but no user, try to load the user
    if (localStorage.token && !isAuthenticated && !loading) {
      console.log('PrivateRoute - Has token but not authenticated, loading user...');
      loadUser();
    }
  }, [isAuthenticated, loading, user, loadUser]);

  if (loading) {
    console.log('PrivateRoute - Loading...');
    return <Spinner />;
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('PrivateRoute - Authenticated, rendering children');
  return children;
};

export default PrivateRoute; 