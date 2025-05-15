import instance from './axiosConfig';

const handleApiError = (error) => {
    console.error('API Error:', error);
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      errorMessage = data.message || `Erreur ${status}: ${errorMessage}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Aucune réponse du serveur. Veuillez vérifier votre connexion internet.';
    }
    
    throw new Error(errorMessage);
  };

const API_URL_ORDINATEURS= 'ordinateurs/';

export const getAllComputers = async () => {
    try{
        const response = await instance.get(API_URL_ORDINATEURS);
        return response.data;
    }catch (error) {
        return handleApiError(error);
    }
  
};

export const getComputerById = async(id)=>{
    try{
        const response = await instance.get(`${API_URL_ORDINATEURS}${id}/`);
        return response.data;
    }catch(error){
        return handleApiError(error);
    }
};

export const createComputer = async (computerData)=>{
    try{
        const response = await instance.post(API_URL_ORDINATEURS,computerData);
        return response.data;
    }catch(error){
        return handleApiError(error);
    }
};

export const updateComputer = async (id,updatedData)=>{
    try{
        const response = await instance.patch(`${API_URL_ORDINATEURS}${id}/`,updatedData);
        return response.data;
    }catch(error){
        return handleApiError(error);
    }
};

export const deleteComputer = async (id)=>{
    try {
        const response = await instance.delete(`${API_URL_ORDINATEURS}${id}/`);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
};

export const searchComputers = async (field, value) => {
    try {
      const response = await instance.get(`${API_URL_ORDINATEURS}search/`, {
        params: { field, value }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };


  const API_URL_PRINTERS= 'impriments/';

  export const getAllPrinters = async () => {
      try{
          const response = await instance.get(API_URL_PRINTERS);
          return response.data;
      }catch (error) {
        return handleApiError(error);
      }
    
  };
  
  export const getPrinterById = async(id)=>{
      try{
          const response = await instance.get(`${API_URL_PRINTERS}${id}/`);
          return response.data;
      }catch(error){
        return handleApiError(error);
      }
  };
  
  export const createPrinter = async (printerData)=>{
      try{
          const response = await instance.post(API_URL_PRINTERS,printerData);
          return response.data;
      }catch(error){
        return handleApiError(error);
      }
  };
  
  export const updatePrinter = async (id,updatedData)=>{
      try{
          const response = await instance.patch(`${API_URL_PRINTERS}${id}/`,updatedData);
          return response.data;
      }catch(error){
        return handleApiError(error);
      }
  };
  
  export const deletePrinter = async (id)=>{
      try {
          const response = await instance.delete(`${API_URL_PRINTERS}${id}/`);
          return response.data;
        } catch (error) {
            return handleApiError(error);
        }
  };
  
  export const searchPrinters = async (field, value) => {
    try {
      const response = await instance.get(`${API_URL_PRINTERS}search/`, {
        params: { field, value }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };
  
    const API_URL_PHONES= 'telephones/';

    export const getAllPhones = async () => {
        try{
            const response = await instance.get(API_URL_PHONES);
            return response.data;
        }catch (error) {
            return handleApiError(error);
        }
      
    };
    
    export const getPhonesById = async(id)=>{
        try{
            const response = await instance.get(`${API_URL_PHONES}${id}/`);
            return response.data;
        }catch(error){
            return handleApiError(error);
        }
    };
    
    export const createPhone = async (printerData)=>{
        try{
            const response = await instance.post(API_URL_PHONES,printerData);
            return response.data;
        }catch(error){
            return handleApiError(error);
        }
    };
    
    export const updatePhone = async (id,updatedData)=>{
        try{
            const response = await instance.patch(`${API_URL_PHONES}${id}/`,updatedData);
            return response.data;
        }catch(error){
            return handleApiError(error);
        }
    };
    
    export const deletePhone = async (id)=>{
        try {
            const response = await instance.delete(`${API_URL_PHONES}${id}/`);
            return response.data;
          } catch (error) {
            return handleApiError(error);
          }
    };
    
    export const searchPhones = async (field, value) => {
        try {
          const response = await instance.get(`${API_URL_PHONES}search/`, {
            params: { field, value }
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      };
    
      const API_URL_ECRANT = 'ecrants/';

      export const getAllEcrants = async () => {
          try {
              const response = await instance.get(API_URL_ECRANT);
              return response.data;
          } catch (error) {
            return handleApiError(error);
          }
      };
      
      export const getEcrantById = async (id) => {
          try {
              const response = await instance.get(`${API_URL_ECRANT}${id}/`);
              return response.data;
          } catch (error) {
            return handleApiError(error);
          }
      };
      
      export const createEcrant = async (ecrantData) => {
          try {
              const response = await instance.post(API_URL_ECRANT, ecrantData);
              return response.data;
          } catch (error) {
            return handleApiError(error);
          }
      };
      
      export const updateEcrant = async (id, updatedData) => {
          try {
              const response = await instance.patch(`${API_URL_ECRANT}${id}/`, updatedData);
              return response.data;
          } catch (error) {
            return handleApiError(error);
          }
      };
      
      export const deleteEcrant = async (id) => {
          try {
              const response = await instance.delete(`${API_URL_ECRANT}${id}/`);
              return response.data;
          } catch (error) {
            return handleApiError(error);
          }
      };
      
      export const searchEcrants = async (field, value) => {
        try {
          const response = await instance.get(`${API_URL_ECRANT}search/`, {
            params: { field, value }
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      };
      