import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../layouts/UserLayout';
import UserDashboard from '../pages/user/Dashboard';
import TicketManagement from '../pages/user/ticketManagement';
import UserProfile from '../pages/common/userProfilePage';
import Myassets from '../pages/common/myassets';
// Importez d'autres pages utilisateur ici

const UserRoutes = (
  <Route
    key="user"
    path="/user"
    element={
      <ProtectedRoute allowedRoles={['utilisateurNormal']}>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="ticketManagement" element={<TicketManagement/>}/>
    <Route path="userProfilePage" element={<UserProfile/>}/>
    <Route path="myassets" element={<Myassets/>}/>
    <Route path="" element={<Navigate to="/user/dashboard" replace />}/>
  </Route>
);

export default UserRoutes;