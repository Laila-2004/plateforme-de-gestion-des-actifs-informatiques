import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';

const PublicRoutes = [
  // Routes publiques
  <Route key="login" path="/login" element={<Login />} />,
  
  // Redirection racine
  <Route key="root" path="/" element={<Navigate to="/login" replace />} />
];

export default PublicRoutes;