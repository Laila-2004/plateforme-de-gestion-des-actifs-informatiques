import React from 'react';
import PublicRoutes from './publicRoutes';
import AdminRoutes from './adminRoutes';
import TechnicianRoutes from './technicianRoutes';
import UserRoutes from './userRoutes';
import NotFoundRoute from './notFoundRoute';

// Regroupement de toutes les routes
const AppRoutes = [
  ...PublicRoutes,  // Déstructure l'array de routes publiques
  AdminRoutes,
  TechnicianRoutes,
  UserRoutes,
  NotFoundRoute
];

export default AppRoutes;