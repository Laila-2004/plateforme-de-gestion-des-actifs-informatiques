import React, { useState, useEffect } from 'react';
import instance from '../../services/api/axiosConfig';
import { AlertTriangle, Calendar, BarChart2, X, Info, Plus } from 'lucide-react';
import { createTicket } from '../../services/api/ticketService';
import { useAuth } from '../../context/AuthContext';
import { getAllComputers, getAllEcrants, getAllPhones, getAllPrinters } from '../../services/api/materielService';
import TicketForm from '../tickets/ticketForm';
import { getAllUsers } from '../../services/api/userService';
import { getAllTickets } from '../../services/api/ticketService';

function MaintenancePredictionDashboard() {
  const { currentUser } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetType, setAssetType] = useState('ordinateur');
  const [technicians, setTechnicians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: 'ouvert',
    priority: 'moyenne',
    category: 'logiciel',
    type_ticket: 'incident',
    description: '',
    assigned_to: null,
    asset: null
  });

  // Récupérer les tickets
  const fetchTickets = async () => {
    try {
      const data = await getAllTickets();
      setTickets(data);
      setFilteredTickets(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des tickets");
      console.error(err);
    }
  };

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

  // Récupérer les technicians
  const fetchTechnicians = async () => {
    try {
      const users = await getAllUsers();
      const techniciansData = users.filter(user => user.role === 'technicien');
      setTechnicians(techniciansData);
    } catch (error) {
      console.error("Erreur lors de la récupération des techniciens:", error);
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await instance.get('predictions/');
        setPredictions(response.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [assetType]);

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      setShowAddModal(false);
      resetForm();
      fetchTickets();
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
      priority: 'moyenne',
      category: 'logiciel',
      type_ticket: 'incident',
      description: '',
      assigned_to: null,
      asset: null
    });
  };
  // Gérer la suppression d'une prédiction
  const handleDeletePrediction = async (id) => {
  try {
    const response = await instance.delete(`predictions/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

  // Nouvelle fonction pour créer un ticket à partir d'une prédiction
  const createTicketFromPrediction = async (prediction) => {
    // Déterminer la priorité basée sur la probabilité
    let priority = 'moyenne';
    if (prediction.probability >= 0.7) {
      priority = 'critique';
    } else if (prediction.probability >= 0.4) {
      priority = 'haute';
    } else {
      priority = 'moyenne';
    }

    // Si la prédiction contient directement l'ID de l'asset et son type, on peut les utiliser
    // Sinon, on essaie de les extraire du nom
    let assetIdFromPrediction = prediction.asset || null;
    let assetTypeFromPrediction = prediction.asset_type || 'ordinateur'; // Valeur par défaut
    
    
    
    // Mettre à jour le type d'asset
    setAssetType(assetTypeFromPrediction);
    
    // Construire le titre et la description
    const title = `Maintenance préventive - ${prediction.asset_name}`;
    const description = `Ticket généré automatiquement suite à une prédiction de maintenance.\n\nProblème prédit: ${prediction.predicted_issue}\nProbabilité: ${(prediction.probability * 100).toFixed(2)}%\nDate de prédiction: ${new Date(prediction.prediction_date).toLocaleString()}`;
    
    // Mettre à jour le formulaire partiellement
    setFormData({
      title: title,
      status: 'ouvert',
      priority: priority,
      category: prediction.predicted_issue.toLowerCase().includes('logiciel') ? 'logiciel' : 'materiel',
      type_ticket: 'maintenance',
      description: description,
      assigned_to: null,
      asset: null // Sera mis à jour après le chargement des assets
    });
    
    // Charger les assets du type approprié avant d'ouvrir le modal
    try {
      // Récupérer les assets selon le type déterminé
      let assetsData = [];
      
      switch (assetTypeFromPrediction) {
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
      
      // Mettre à jour les assets disponibles
      setAssets(assetsData);
      
      // Si nous avons déjà l'ID de l'asset, on l'utilise directement
      if (assetIdFromPrediction) {
        setFormData(prev => ({
          ...prev,
          asset: assetIdFromPrediction
        }));
      } else {
        // Sinon, on cherche l'asset correspondant dans la liste
        const matchingAsset = assetsData.find(asset => {
          // Vérifier si le nom de l'asset de prédiction contient la marque et le modèle
          const assetInfo = `${asset.marque} ${asset.modele}`.toLowerCase();
          return prediction.asset_name.toLowerCase().includes(assetInfo) || 
                 // Ou si le numéro de série correspond
                 (asset.numero_serie && prediction.asset_name.toLowerCase().includes(asset.numero_serie.toLowerCase()));
        });
        
        // Si un asset correspondant est trouvé, le sélectionner
        if (matchingAsset) {
          setFormData(prev => ({
            ...prev,
            asset: matchingAsset.id
          }));
        }
      }
      
      // Ouvrir le modal après avoir récupéré et configuré les assets
      setShowAddModal(true);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
      // En cas d'erreur, on ouvre quand même le modal mais sans pré-remplir l'asset
      setShowAddModal(true);
    }
  };

  // Fonction pour déterminer la couleur basée sur la probabilité
  const getProbabilityColorClass = (probability) => {
    if (probability >= 0.7) return "bg-red-100 text-red-700 border-red-300";
    if (probability >= 0.4) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-green-100 text-green-700 border-green-300";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <BarChart2 className="mr-3" />
            Prédictions de Maintenance
          </h2>
          <p className="text-gray-600 mt-2">Visualisation des problèmes potentiels sur vos équipements</p>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center text-blue-700">
            <Info className="mr-2" />
            <span>Aucune prédiction disponible pour le moment.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map(prediction => {
              const probabilityPercentage = (prediction.probability * 100).toFixed(2);
              const colorClass = getProbabilityColorClass(prediction.probability);
              
              return (
                <div key={prediction.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-500">ID: {prediction.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {probabilityPercentage}% de risque
                      </span>
                      <button
                          onClick={() => handleDeletePrediction(prediction.id)}
                          className="p-1 bg-gray-50 hover:bg-red-300 text-gray-400 hover:text-red-600 transition-colors w-5"
                          title="Supprimer la prédiction"
                        >
                          <X className="h-4 w-4" />
                        </button>
                    </div>
                    <h3 className="font-bold text-xl mt-2 text-gray-800">{prediction.asset_name}</h3>
                    
                  </div>
                   
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      <div className="mr-3 mt-1">
                        <AlertTriangle className="text-yellow-500" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Problème Prédit</p>
                        <p className="text-gray-700">{prediction.predicted_issue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="mr-3 mt-1">
                        <Calendar className="text-blue-500" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date de Prédiction</p>
                        <p className="text-gray-700">{new Date(prediction.prediction_date).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Bouton pour créer un ticket basé sur cette prédiction */}
                    <button 
                      onClick={() => createTicketFromPrediction(prediction)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Créer un ticket de maintenance
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

export default MaintenancePredictionDashboard;