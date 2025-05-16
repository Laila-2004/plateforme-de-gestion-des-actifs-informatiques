import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/userManagement';
import TicketMangement from '../pages/admin/ticketManagement';
import DepartmentManagement from '../pages/admin/departmentManagement';
import MaterialManagement from '../pages/admin/materielManagement';
import { UserPlusIcon } from 'lucide-react';
import UserProfilePage from '../pages/common/userProfilePage';
import PanneDashboard from '../pages/admin/PanneDashboard';
// Importez d'autres pages admin ici

const AdminRoutes = (
  <Route
    key="admin"
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="userManagement" element={<Users />} />
    <Route path="ticketManagement" element={<TicketMangement /> }/>
    <Route path="departmentManagement" element={<DepartmentManagement/>}  />
    <Route path="materielManagement" element={<MaterialManagement/>}/>
    <Route path='userProfilePage' element={<UserProfilePage/>}/>
    <Route path='PannaDashboard' element={<PanneDashboard/>}/>
  </Route>
);

export default AdminRoutes;