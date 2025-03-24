import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizDetails from './pages/QuizDetails';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Styles
import './assets/css/styles.css';

// Check for token in localStorage and set auth token on initial load
const token = localStorage.getItem('token');
if (token) {
  console.log('App initialization: Token found in localStorage');
  setAuthToken(token);
} else {
  console.log('App initialization: No token found in localStorage');
  setAuthToken(null);
}

const AppContent = () => {
  const { loadUser } = React.useContext(AuthContext);

  // Load user on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing authentication...');
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Token found, loading user...');
        try {
          await loadUser();
        } catch (error) {
          console.error('Failed to load user during initialization:', error);
        }
      } else {
        console.log('No token found during initialization');
      }
    };
    
    initializeAuth();
  }, [loadUser]);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Alert />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizDetails />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/quizzes/create" element={
              <PrivateRoute>
                <CreateQuiz />
              </PrivateRoute>
            } />
            
            <Route path="/quizzes/edit/:id" element={
              <PrivateRoute>
                <EditQuiz />
              </PrivateRoute>
            } />
            
            <Route path="/quizzes/:id/take" element={
              <PrivateRoute>
                <TakeQuiz />
              </PrivateRoute>
            } />
            
            <Route path="/results/:id" element={
              <PrivateRoute>
                <QuizResults />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </AuthProvider>
  );
};

export default App; 