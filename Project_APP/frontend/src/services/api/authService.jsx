import axios from 'axios';
import instance from './axiosConfig'; // Ton axios avec intercepteur de token
import {
  setToken,
  getToken,
  removeToken,
  decodeToken,
  isTokenExpired,
} from '../utils/tokenUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const authService = {
  /**
   * Connexion de l'utilisateur
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}auth/login/`, { username, password });

      if (response.data.access) {
        localStorage.setItem('user', JSON.stringify(response.data)); // Sauvegarde access + refresh
        setToken(response.data.access); // Sauvegarde token court
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    removeToken();
    localStorage.removeItem('user');
  },

  /**
   * Récupère l'utilisateur actuel depuis localStorage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Récupère les infos utilisateur via l'API
   */
  getUserInfo: async () => {
    try {
      const response = await instance.get('auth/user-info/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Rafraîchit le token si nécessaire (peut être utilisé ailleurs)
   */
  refreshAccessToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.refresh) {
      throw new Error('Aucun token de rafraîchissement trouvé');
    }

    try {
      const response = await axios.post(`${API_URL}auth/token/refresh/`, {
        refresh: user.refresh,
      });

      user.access = response.data.access;
      localStorage.setItem('user', JSON.stringify(user));
      setToken(user.access);
      return user.access;
    } catch (error) {
      authService.logout(); // Supprime tout si le refresh échoue
      window.location.href = '/login';
      throw error;
    }
  },
};

export default authService;
