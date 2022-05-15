import React from 'react';
import { Router } from '@reach/router';
import Profile from '../components/profile';
import { AuthProvider } from '../context/AuthContext';
import { FetchProvider } from '../context/FetchContext';

function AppRoutes() {
  return (
    <Router basepath="/app">
      <Profile path="/profile" />
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
