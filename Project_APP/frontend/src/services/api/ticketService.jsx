import instance from './axiosConfig';

const API_URL = 'tickets/';

// 📌 Ajouter un ticket
export const createTicket = async (ticketData) => {
  try {
    const response = await instance.post(API_URL, ticketData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Obtenir tous les tickets
export const getAllTickets = async () => {
  try {
    const response = await instance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Obtenir un ticket par ID
export const getTicketById = async (id) => {
  try {
    const response = await instance.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du ticket ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Mettre à jour un ticket
export const updateTicket = async (id, updatedData) => {
  try {
    const response = await instance.patch(`${API_URL}${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du ticket ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Supprimer un ticket
export const deleteTicket = async (id) => {
  try {
    const response = await instance.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du ticket ${id}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Rechercher ou filtrer des tickets
export const searchTickets = async (params) => {
  try {
    const response = await instance.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des tickets:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};
