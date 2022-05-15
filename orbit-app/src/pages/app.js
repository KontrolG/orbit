import React from 'react';
import { Router } from '@reach/router';
import Profile from '../components/profile';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FetchProvider } from '../context/FetchContext';
import { useContext } from 'react';
import { navigate } from 'gatsby';
import Login from '../components/login';
import Signup from '../components/signup';

function PrivateRoute({ component: Component, ...restProps }) {
  const { authState, isAuthenticated } = useContext(AuthContext);

  if (!authState) return null;

  if (!isAuthenticated()) {
    navigate('/app/login');
    return null;
  }

  return <Component {...restProps} />;
}

function AppRoutes() {
  return (
    <Router basepath="/app">
      <PrivateRoute component={Profile} path="/profile" />
      <Login path="/login" />
      <Signup path="/signup" />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <FetchProvider>
        <AppRoutes />
      </FetchProvider>
    </AuthProvider>
  );
}

export default App;
