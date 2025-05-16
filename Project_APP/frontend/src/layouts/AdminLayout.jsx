// src/layouts/AdminLayout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationsBell from '../components/notification/NotificationsBell';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Gestion IT</h2>
          <p className="text-sm opacity-75">Panneau administrateur</p>
        </div>
        <nav className="mt-8">
          <NavLink to="/admin/dashboard" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Tableau de bord
          </NavLink>
          <NavLink to="/admin/userManagement" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion des Utilisateurs
          </NavLink>
          <NavLink to="/admin/ticketManagement" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion des Tickets
          </NavLink>
          <NavLink to="/admin/departmentManagement" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion des departements
          </NavLink>
          <NavLink to="/admin/materielManagement" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion de materiels
          </NavLink>
          <NavLink to="/admin/userProfilePage" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion de Profile
          </NavLink>
          <NavLink to="/admin/PannaDashboard" className={({ isActive }) => 
            `block py-2 px-4 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
          }>
            Gestion de Profile
          </NavLink>
        </nav>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Administration</h1>
            <div className="flex items-center space-x-4">
            <NotificationsBell/>
              <span>{currentUser?.user?.username}</span>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>
        
        {/* Contenu de la page */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout