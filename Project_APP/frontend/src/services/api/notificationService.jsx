import instance from './axiosConfig'; // Ton instance Axios configurée

// Récupérer les notifications de l'utilisateur connecté
export const getchNotifications = async () => {
  try {
    const response = await instance.get('notifications/'); // Assure-toi que cette route existe côté Django
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};

// Marquer une notification comme lue
export const markAsRead = async (notificationId) => {
  try {
    const response = await instance.patch(`notifications/${notificationId}/`, {
      read: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};
export const deleteNotification = async (notificationId)=>{
    try{
        const response = await instance.delete(`notifications/${notificationId}/`);
        return response.data;
    }catch(err){
        console.error("Erreur lors de la suppression la notification :", err);
    throw err;
    }
}
