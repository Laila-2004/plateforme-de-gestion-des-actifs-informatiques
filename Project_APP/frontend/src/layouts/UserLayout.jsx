import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationsBell from '../components/notification/NotificationsBell';
import { 
  Home, 
  Ticket, 
  Monitor,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  UserCircle,
  Shield,
  Settings,
  Activity
} from 'lucide-react';
import ChatBot from '../components/chat/chatbot';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Tableau de bord', href: '/user/dashboard', icon: Home, color: 'from-blue-500 to-blue-600', shortName: 'Dashboard' },
    { name: 'Mes Tickets', href: '/user/ticketManagement', icon: Ticket, color: 'from-orange-500 to-orange-600', shortName: 'Tickets' },
    { name: 'Mes équipements', href: '/user/myassets', icon: Monitor, color: 'from-green-500 to-green-600', shortName: 'Équipements' },
    { name: 'Mon Profil', href: '/user/userProfilePage', icon: User, color: 'from-purple-500 to-purple-600', shortName: 'Profil' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  const getUserInitials = () => {
    const name = currentUser?.user?.username || currentUser?.user?.first_name || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200/60
        transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72 h-screen overflow-y-auto shadow-2xl shadow-slate-900/10
      `}>
        {/* Sidebar Header */}
        <div className="relative h-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              {!sidebarCollapsed && (
                <div className="transition-all duration-300">
                  <h1 className="text-white font-bold text-xl tracking-tight">Gestion IT</h1>
                  <p className="text-blue-100/80 text-sm font-medium">Espace Utilisateur</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Desktop collapse button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-xl text-white/80 hover:text-white bg-blue-500 hover:bg-white/20 transition-all duration-200"
                title={sidebarCollapsed ? "Développer le menu" : "Réduire le menu"}
              >
                <Menu className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3 transition-all duration-300">
                Navigation
              </p>
            )}
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium 
                      transition-all duration-300 ease-out relative overflow-hidden
                      ${sidebarCollapsed ? 'justify-center' : ''}
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 hover:transform hover:scale-[1.01] hover:shadow-md'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0
                      ${({ isActive }) => isActive 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : `bg-gradient-to-br ${item.color} text-white group-hover:scale-110`
                      }
                    `}>
                      <item.icon className="w-4 h-4 text-black" />
                    </div>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 transition-all duration-300">{item.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                      </div>
                    )}
                    
                    {/* Active indicator */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50/80 to-transparent backdrop-blur-sm border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className={`group w-full flex items-center p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium
              hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]
              ${sidebarCollapsed ? 'justify-center space-x-0' : 'space-x-3'}
            `}
            title={sidebarCollapsed ? "Déconnexion" : ''}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200 flex-shrink-0" />
            {!sidebarCollapsed && <span>Déconnexion</span>}
            
            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                Déconnexion
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 sticky top-0 z-30">
          <div className="flex items-center justify-between h-18 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Espace Utilisateur
                </h2>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Gérez vos tickets et équipements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="transform hover:scale-110 transition-transform duration-200">
                <NotificationsBell />
              </div>
              
              <div className="flex items-center space-x-4 bg-slate-50 rounded-2xl p-2 border border-slate-200/60">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {currentUser?.user?.username || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Utilisateur</p>
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white text-white font-bold">
                  {getUserInitials()}
                </div>
              </div>
            </div>
          </div>
        </header>
          <ChatBot />
        {/* Main content with enhanced styling */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-white">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/60 min-h-[calc(100vh-12rem)] p-1">
                <div className="p-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                © {new Date().getFullYear()} Gestion IT - Interface Utilisateur
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Sécurisé</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span>En ligne</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;