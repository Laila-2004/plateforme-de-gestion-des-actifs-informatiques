import instance from './axiosConfig'; // Axios déjà configuré avec baseURL et token

const API_URL = 'app_users/'; // Assure-toi que l'endpoint Django correspond

// 📌 Obtenir tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const response = await instance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Obtenir un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await instance.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};
export const getUsersByRole = async (role) => {
  try {
    const response = await instance.get(`${API_URL}role/${role}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur :`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Créer un nouvel utilisateur
export const createUser = async (userData) => {
  try {
    const response = await instance.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Mettre à jour un utilisateur
export const updateUser = async (id, updatedData) => {
  try {
    const response = await instance.put(`${API_URL}${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l’utilisateur ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const response = await instance.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l’utilisateur ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Rechercher des utilisateurs (par nom, rôle, etc.)
export const searchUsers = async (params) => {
  try {
    const response = await instance.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d’utilisateurs:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};
