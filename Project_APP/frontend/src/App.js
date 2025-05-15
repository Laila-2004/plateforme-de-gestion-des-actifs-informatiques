
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {AppRoutes}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;