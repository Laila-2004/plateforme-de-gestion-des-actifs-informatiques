import instance from './axiosConfig';

const API_URL= 'services/';

export const getAllServices = async () => {
    try{
        const response = await instance.get(API_URL);
        return response.data;
    }catch (error) {
        console.error('Erreur lors de la récupération des Services:', error);
        throw error.response?.data || 'Erreur serveur';
      }
};

export const getServiceById = async(id)=>{
    try{
        const response = await instance.get(`${API_URL}${id}`);
        return response.data;
    }catch(error){
        console.error(`Erreur lors de la récupération de le service: ${id}`, error);
        throw error.response?.data || 'Erreur serveur';
    }
};

export const createService = async (departementData)=>{
    try{
        const response = await instance.post(API_URL,departementData);
        return response.data;
    }catch(error){
        console.error('Erreur lors de la création de le sevice ',error);
        throw error.response?.data || 'Erreur serveur';
    }
};

export const updateService = async (id,updatedData)=>{
    try{
        const response = await instance.patch(`${API_URL}${id}/`,updatedData);
        return response.data;
    }catch(error){
        console.error(`Erreur lors de la mise à jour de  le service ${id}`,error );
        throw error.response?.data || 'Erreur serveur';
    }
};

export const deleteService = async (id)=>{
    try {
        const response = await instance.delete(`${API_URL}${id}/`);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la suppression de le service ${id}:`, error);
        throw error.response?.data || 'Erreur serveur';
      }
};

export const searchService = async (params) => {
    try {
      const response = await instance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de le service:', error);
      throw error.response?.data || 'Erreur serveur';
    }
  };