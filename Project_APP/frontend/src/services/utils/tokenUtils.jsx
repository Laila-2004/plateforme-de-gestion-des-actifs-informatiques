// services/utils/tokenUtils.js

/**
 * Enregistre le token dans le localStorage
 * @param {string} token
 */
export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  /**
   * Récupère le token depuis le localStorage
   * @returns {string|null}
   */
  export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  /**
   * Supprime le token du localStorage
   */
  export const removeToken = () => {
    localStorage.removeItem('authToken');
  };
  
  /**
   * Décode un token JWT pour en extraire le payload
   * @param {string} token
   * @returns {object|null}
   */
  export const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload); // décode en base64
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return null;
    }
  };
  
  /**
   * Vérifie si le token est expiré
   * @param {string} token
   * @returns {boolean}
   */
  export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
  
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };
  