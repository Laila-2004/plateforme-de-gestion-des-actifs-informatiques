import React, { useState, useEffect } from 'react';
import instance from '../../services/api/axiosConfig';
import { AlertCircle, Calendar, AlertTriangle, X, Info, Plus } from 'lucide-react';
import { createTicket } from '../../services/api/ticketService';
import { useAuth } from '../../context/AuthContext';
import { getAllComputers, getAllEcrants, getAllPhones, getAllPrinters } from '../../services/api/materielService';
import TicketForm from '../tickets/ticketForm';
import { getAllUsers } from '../../services/api/userService';

function HighRiskAssetsDashboard() {
  const { currentUser } = useAuth();
  const [highRiskAssets, setHighRiskAssets] = useState([]);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetType, setAssetType] = useState('ordinateur');
  const [technicians, setTechnicians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: 'ouvert',
    priority: 'haute',
    category: 'materiel',
    type_ticket: 'incident',
    description: '',
    assigned_to: null,
    asset: null
  });

  useEffect(() => {
    const fetchHighRiskAssets = async () => {
      try {
        const response = await instance.get('predictions/high_risk_assets/');
        setHighRiskAssets(response.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching high risk assets:", error);
      }
    };

    fetchHighRiskAssets();
    fetchTechnicians();
  }, []);

  // Récupérer le matériel
  const fetchAssets = async (assetTypeToFetch = null) => {
    try {
      let assetsData = [];
      const typeToUse = assetTypeToFetch || assetType;
      
      switch (typeToUse) {
        case 'ordinateur':
          assetsData = await getAllComputers();
          break;
        case 'imprimante':
          assetsData = await getAllPrinters();
          break;
        case 'telephone':
          assetsData = await getAllPhones();
          break;
        case 'ecran':
          assetsData = await getAllEcrants();
          break;
        default:
          assetsData = [];
      }
      
      setAssets(assetsData);
      return assetsData;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
      return [];
    }
  };

  // Récupérer les techniciens
  const fetchTechnicians = async () => {
    try {
      const users = await getAllUsers();
      const techniciansData = users.filter(user => user.role === 'technicien');
      setTechnicians(techniciansData);
    } catch (error) {
      console.error("Erreur lors de la récupération des techniciens:", error);
    }
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError("Erreur lors de la création du ticket");
      console.error(err);
    }
  };

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssetTypeChange = (e) => {
    setAssetType(e.target.value);
    // Réinitialiser la sélection d'asset
    setFormData(prev => ({
      ...prev,
      asset: ''
    }));
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      status: 'ouvert',
      priority: 'haute',
      category: 'materiel',
      type_ticket: 'incident',
      description: '',
      assigned_to: null,
      asset: null
    });
  };

  // Fonction pour créer un ticket à partir d'un asset à haut risque
  const createTicketFromHighRiskAsset = async (asset) => {
    // Tous les assets à haut risque ont une priorité critique ou haute
    const priority = asset.probability >= 0.8 ? 'critique' : 'haute';

    // Détermine le type d'asset à partir du nom (comme dans l'autre composant)
    let assetTypeFromPrediction = 'ordinateur'; // Valeur par défaut
    const assetName = asset.asset_name.toLowerCase();
    
    if (assetName.includes('imprimante')) {
      assetTypeFromPrediction = 'imprimante';
    } else if (assetName.includes('téléphone') || assetName.includes('telephone')) {
      assetTypeFromPrediction = 'telephone';
    } else if (assetName.includes('écran') || assetName.includes('ecran')) {
      assetTypeFromPrediction = 'ecran';
    }
    
    // Mettre à jour le type d'asset
    setAssetType(assetTypeFromPrediction);
    
    // Construire le titre et la description
    const title = `Maintenance urgente - ${asset.asset_name}`;
    const description = `Ticket généré suite à une alerte de haut risque.\n\nProblème prédit: ${asset.predicted_issue}\nProbabilité de panne: ${(asset.probability * 100).toFixed(2)}%\nDate de l'alerte: ${new Date(asset.prediction_date).toLocaleString()}`;
    
    // Mettre à jour le formulaire partiellement
    setFormData({
      title: title,
      status: 'ouvert',
      priority: priority,
      category: asset.predicted_issue.toLowerCase().includes('logiciel') ? 'logiciel' : 'materiel',
      type_ticket: 'incident', // Pour les hauts risques, on considère que c'est un incident à prévenir
      description: description,
      assigned_to: null,
      asset: null // Sera mis à jour après le chargement des assets
    });
    
    try {
      // Récupérer les assets selon le type déterminé
      const assetsData = await fetchAssets(assetTypeFromPrediction);
      
      // Chercher l'asset correspondant dans la liste
      const matchingAsset = assetsData.find(item => {
        // Vérifier si le nom de l'asset contient la marque et le modèle
        if (item.marque && item.modele) {
          const assetInfo = `${item.marque} ${item.modele}`.toLowerCase();
          return asset.asset_name.toLowerCase().includes(assetInfo) || 
                // Ou si le numéro de série correspond
                (item.numero_serie && asset.asset_name.toLowerCase().includes(item.numero_serie.toLowerCase()));
        }
        return false;
      });
      
      // Si un asset correspondant est trouvé, le sélectionner
      if (matchingAsset) {
        setFormData(prev => ({
          ...prev,
          asset: matchingAsset.id
        }));
      }
      
      // Ouvrir le modal après avoir récupéré et configuré les assets
      setShowAddModal(true);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
      // En cas d'erreur, on ouvre quand même le modal mais sans pré-remplir l'asset
      setShowAddModal(true);
    }
  };

  const handleDeletePrediction = async (id) => {
  try {
    const response = await instance.delete(`predictions/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-red-700 flex items-center">
            <AlertCircle className="mr-3" />
            Actifs à Haut Risque de Panne
          </h2>
          <p className="text-gray-600 mt-2">Équipements nécessitant une attention immédiate</p>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        ) : highRiskAssets.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
            <Info className="mr-2" />
            <span>Aucun actif à haut risque détecté pour le moment.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highRiskAssets.map(asset => {
              const probabilityPercentage = (asset.probability * 100).toFixed(2);
              
              return (
                <div key={asset.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4 border-red-500">
                  <div className="p-5 border-b border-gray-100 bg-red-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-500">ID: {asset.id}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                        {probabilityPercentage}% de risque
                      </span>
                      <button
                          onClick={() => handleDeletePrediction(asset.id)}
                          className="p-1 bg-gray-50 hover:bg-red-300 text-gray-400 hover:text-red-600 transition-colors w-5"
                          title="Supprimer la prédiction"
                        >
                          <X className="h-4 w-4" />
                        </button>
                    </div>
                    <h3 className="font-bold text-xl mt-2 text-gray-800">{asset.asset_name}</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      <div className="mr-3 mt-1">
                        <AlertTriangle className="text-red-500" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Problème Prédit</p>
                        <p className="text-gray-700">{asset.predicted_issue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="mr-3 mt-1">
                        <Calendar className="text-blue-500" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date de Prédiction</p>
                        <p className="text-gray-700">{new Date(asset.prediction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Bouton pour créer un ticket basé sur cet asset à haut risque */}
                    <button 
                      onClick={() => createTicketFromHighRiskAsset(asset)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Créer un ticket d'urgence
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal pour ajouter un ticket */}
      {showAddModal && (
        <TicketForm 
          currentUser={currentUser.user}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleAddTicket}
          handleAssetTypeChange={handleAssetTypeChange}
          assetType={assetType}
          assets={assets}
          technicians={technicians}
          onClose={() => setShowAddModal(false)}
          isEditing={false}
        />
      )}
    </div>
  );
}

export default HighRiskAssetsDashboard;