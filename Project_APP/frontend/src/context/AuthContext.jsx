// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Erreur d'initialisation de l'authentification:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(username, password);
      setCurrentUser(userData);
      
      // Redirection en fonction du rôle
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'technicien') {
        navigate('/tech/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAdmin: () => hasRole('ADMIN'),
    isTechnician: () => hasRole('TECHNICIAN'),
    isStandardUser: () => hasRole('USER'),
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);