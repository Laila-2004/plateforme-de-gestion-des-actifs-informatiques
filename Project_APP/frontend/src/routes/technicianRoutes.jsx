import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import TechnicianLayout from '../layouts/TechnicianLayout';
import TechDashboard from '../pages/technician/Dashboard';
import UserProfile from '../pages/common/userProfilePage';
import TicketManagement from '../pages/technician/ticketManagement';
import MaterielPage from '../pages/admin/materielManagement';
import Myassets from '../pages/common/myassets';
// Importez d'autres pages technicien ici

const TechnicianRoutes = (
  <Route
    key="tech"
    path="/tech"
    element={
      <ProtectedRoute allowedRoles={['technicien']}>
        <TechnicianLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<TechDashboard />} />
    <Route path="userProfilePage" element={<UserProfile />} />
    <Route path='ticketManagement' element={< TicketManagement/>}/>
    <Route path='materielManagement' element={< MaterielPage/>}/>
    <Route path='myassets' element={< Myassets/>}/>
  </Route>
);

export default TechnicianRoutes;