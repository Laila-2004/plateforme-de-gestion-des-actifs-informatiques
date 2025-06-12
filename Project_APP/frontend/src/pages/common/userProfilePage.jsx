import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserById, updateUser } from '../../services/api/userService';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.user?.id) return;
      try {
        setLoading(true);
        const data = await getUserById(currentUser.user.id);
        setUserData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '',
          confirmPassword: '',
        });
      
      } catch (err) {
        setError("Impossible de charger les informations du profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validation du mot de passe
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ne pas envoyer le champ confirmPassword au backend
      const dataToSubmit = {...formData};
      delete dataToSubmit.confirmPassword;
      
      // Si le mot de passe est vide, ne pas l'envoyer
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      // Mettre à jour l'utilisateur
      await updateUser(currentUser.user.id, dataToSubmit);
      
      // Mettre à jour les données locales
      setUserData({
        ...userData,
        email: formData.email,
        phone: formData.phone
      });
      
      setSuccess(true);
      setShowModal(false);
      
      // Faire disparaître le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )
  }
  
  if (error && !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  // Modal pour la modification du profil
  const EditProfileModal = () => {
    // La condition suivante a été supprimée pour afficher le modal en permanence
      if (!showModal) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center z-50 p-4 items-start overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Modifier mon profil</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-red-600 w-11 bg-white hover:bg-red-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Champs en lecture seule */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                className="w-full bg-gray-100 p-3 rounded border border-gray-300"
                value={userData.username}
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Le nom d'utilisateur ne peut pas être modifié</p>
            </div>
  
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rôle</label>
              <input
                type="text"
                className="w-full bg-gray-100 p-3 rounded border border-gray-300"
                value={
                  userData.role === 'admin' ? 'Administrateur' :
                  userData.role === 'technicien' ? 'Technicien' : 'Utilisateur Normal'
                }
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Le rôle ne peut pas être modifié</p>
            </div>
  
            {/* Champs modifiables */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prenom</label>
              <input
                type="text"
                name="first_name"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom</label>
              <input
                type="text"
                name="last_name"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
  
            <div>
              <label className="block text-gray-700 font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
  
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Laissez vide pour ne pas modifier"
              />
            </div>
  
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>
          </div>
  
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Mon Profil</h1>
        
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Profil mis à jour avec succès!
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Nom d'utilisateur</h3>
            <p className="mt-1 text-lg font-medium">{userData.username}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
            <p className="mt-1 text-lg font-medium">
              {userData.role === 'admin' ? 'Administrateur' : 
               userData.role === 'technicien' ? 'Technicien' : 'Utilisateur Normal'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Prenom</h3>
            <p className="mt-1 text-lg font-medium">{userData.first_name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Nom</h3>
            <p className="mt-1 text-lg font-medium">{userData.last_name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg font-medium">{userData.email}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
            <p className="mt-1 text-lg font-medium">{userData.phone || "Non renseigné"}</p>
          </div>
        </div>
        
        {userData.service && (
          <div className="mb-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Information de service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Service</h3>
                <p className="mt-1 text-lg font-medium">{userData.service_details.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Département</h3>
                <p className="mt-1 text-lg font-medium">{userData.service_details.department_details.name}</p>
              </div>
              {userData.service_details.department_details && (
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Description du service</h3>
                  <p className="mt-1">{userData.service_details.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Modifier mes informations
          </button>
        </div>
        
        {/* Modal pour la modification */}
        <EditProfileModal />
      </div>
    </div>
  );
};

export default UserProfile;