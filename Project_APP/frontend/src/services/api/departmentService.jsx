import instance from './axiosConfig';

const API_URL= 'departments/';

export const getAllDepartments = async () => {
    try{
        const response = await instance.get(API_URL);
        return response.data;
    }catch (error) {
        console.error('Erreur lors de la récupération des departements:', error);
        throw error.response?.data || 'Erreur serveur';
      }
  
};

export const getDepartmentById = async(id)=>{
    try{
        const response = await instance.get(`${API_URL}${id}`);
        return response.data;
    }catch(error){
        console.error(`Erreur lors de la récupération de la departement: ${id}`, error);
        throw error.response?.data || 'Erreur serveur';
    }
};

export const createDepartment = async (departementData)=>{
    try{
        const response = await instance.post(API_URL,departementData);
        return response.data;
    }catch(error){
        console.error('Erreur lors de la création de la département ',error);
        throw error.response?.data || 'Erreur serveur';
    }
};

export const updateDepartment = async (id,updatedData)=>{
    try{
        const response = await instance.put(`${API_URL}${id}`,updatedData);
        return response.data;
    }catch(error){
        console.error(`Erreur lors de la mise à jour de  la département ${id}`,error );
        throw error.response?.data || 'Erreur serveur';
    }
};

export const deleteDepartment = async (id)=>{
    try {
        const response = await instance.delete(`${API_URL}${id}/`);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la suppression de la département ${id}:`, error);
        throw error.response?.data || 'Erreur serveur';
      }
};

export const searchDepartment= async (params) => {
    try {
      const response = await instance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de la département:', error);
      throw error.response?.data || 'Erreur serveur';
    }
  };