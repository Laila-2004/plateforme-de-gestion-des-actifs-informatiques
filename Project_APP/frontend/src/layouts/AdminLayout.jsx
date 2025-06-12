// src/layouts/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationsBell from '../components/notification/NotificationsBell';
import { 
  Home, 
  Users, 
  Ticket, 
  Building2,
  Monitor,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';
import ChatBot from '../components/chat/chatbot';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home, color: 'from-blue-500 to-blue-600', shortName: 'Dashboard' },
    { name: 'Gestion des Utilisateurs', href: '/admin/userManagement', icon: Users, color: 'from-purple-500 to-purple-600', shortName: 'Utilisateurs' },
    { name: 'Gestion des Tickets', href: '/admin/ticketManagement', icon: Ticket, color: 'from-orange-500 to-orange-600', shortName: 'Tickets' },
    { name: 'Gestion des départements', href: '/admin/departmentManagement', icon: Building2, color: 'from-indigo-500 to-indigo-600', shortName: 'Départements' },
    { name: 'Gestion de matériels', href: '/admin/materielManagement', icon: Monitor, color: 'from-green-500 to-green-600', shortName: 'Matériels' },
    { name: 'Prédictions de Maintenance', href: '/admin/PannaDashboard', icon: BarChart3, color: 'from-red-500 to-red-600', shortName: 'Maintenance' },
    { name: 'Mes équipements', href: '/admin/myassets', icon: Settings, color: 'from-gray-500 to-gray-600', shortName: 'Équipements' },
    { name: 'Gestion de Profil', href: '/admin/userProfilePage', icon: User, color: 'from-teal-500 to-teal-600', shortName: 'Profil' },
  ];

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
        <div className="relative h-20 px-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              {!sidebarCollapsed && (
                <div className="transition-all duration-300">
                  <h1 className="text-white font-bold text-xl tracking-tight">Gestion IT</h1>
                  <p className="text-emerald-100/80 text-sm font-medium">Admin Panel</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Desktop collapse button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 bg-emerald-600"
                title={sidebarCollapsed ? "Développer le menu" : "Réduire le menu"}
              >
                <Menu className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3 transition-all duration-300">
                Navigation Principale
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
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]' 
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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
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
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Administration
                </h2>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Gérez votre système IT avec efficacité
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
                    {currentUser?.user?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Administrateur</p>
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <User className="w-5 h-5 text-white" />
                </div>
                
                <button
                  onClick={logout}
                  className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-slate-200/60 hover:border-red-200 shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <ChatBot />

        {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-white p-6">
                  <div className="max-w-7xl mx-auto">
                    <Outlet />
                  </div>
                </main>
      </div>
    </div>
  );
};

export default AdminLayout;