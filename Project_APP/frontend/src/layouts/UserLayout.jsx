import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationsBell from '../components/notification/NotificationsBell';

// Importez vos icônes ici, par exemple:
// import { FaHome, FaUser, FaClipboard, FaCog, FaSignOutAlt } from 'react-icons/fa';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-blue-700 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        {/* Logo */}
         <div className="p-4">
          <h2 className="text-2xl font-bold">Gestion IT</h2>
          <p className="text-sm opacity-75">Panneau utilisateur</p>
        </div>
        {/* User Info */}
        <div className="px-4 py-2 border-t border-b border-blue-800">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="font-semibold">{currentUser?.user?.username || 'Utilisateur'}</h4>
              <p className="text-xs text-blue-200">{currentUser?.user?.email || 'utilisateur@exemple.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav>
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                to="/user/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-md text-white hover:bg-blue-600"
              >
                {/* <FaHome className="h-5 w-5" /> */}
                <span>Tableau de bord</span>
              </Link>
              <Link 
                to="/user/ticketManagement" 
                className="flex items-center space-x-3 p-3 rounded-md text-white hover:bg-blue-600"
              >
                {/* <FaHome className="h-5 w-5" /> */}
                <span>Mes Tickets</span>
              </Link>
              <Link 
                to="/user/userProfilePage" 
                className="flex items-center space-x-3 p-3 rounded-md text-white hover:bg-blue-600"
              >
                {/* <FaHome className="h-5 w-5" /> */}
                <span>Mon Profil</span>
              </Link>

            </li>
           
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-md text-white hover:bg-blue-600"
          >
            {/* <FaSignOutAlt className="h-5 w-5" /> */}
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden text-gray-700 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div className="text-xl font-bold text-gray-700">Espace Utilisateur</div>
            <div className="flex items-center ">
              <div className='mr-4'>
                <NotificationsBell /> 
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {currentUser?.user?.first_name.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 shadow-inner">
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} MonApp - Tous droits réservés
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;