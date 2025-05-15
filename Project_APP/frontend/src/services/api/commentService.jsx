import instance from './axiosConfig';

// 📌 Ajouter un commentaire à un ticket
export const createTicketComment = async (ticketId, commentData) => {
  try {
    const response = await instance.post('/ticket-comments/', {
      ticket: ticketId,
      ...commentData
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Obtenir les commentaires d'un ticket
export const getTicketComments = async (ticketId) => {
  try {
    const response = await instance.get(`/ticket-comments/?ticket=${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    throw error.response?.data || 'Erreur serveur';
  }
};

// 📌 Supprimer un commentaire
export const deleteTicketComment = async (commentId) => {
  try {
    const response = await instance.delete(`/ticket-comments/${commentId}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
    throw error.response?.data || 'Erreur serveur';
  }
};

export default {
  createTicketComment,
  getTicketComments,
  deleteTicketComment
};