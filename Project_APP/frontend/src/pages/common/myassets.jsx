import React, { useState, useEffect } from 'react';
import { Computer, Printer, Phone, Monitor, User, Calendar, Hash, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllComputers, getAllEcrants, getAllPhones, getAllPrinters } from '../../services/api/materielService';

// Wrapper functions pour récupérer les données
const AllComputers = async () => {
  try {
    const response = await getAllComputers();
    console.log('Response getAllComputers:', response);
    return response.data || response; // Au cas où la structure serait différente
  } catch (error) {
    console.error('Erreur getAllComputers:', error);
    return [];
  }
};

const AllPrinters = async () => {
  try {
    const response = await getAllPrinters();
    console.log('Response getAllPrinters:', response);
    return response.data || response;
  } catch (error) {
    console.error('Erreur getAllPrinters:', error);
    return [];
  }
};

const AllPhones = async () => {
  try {
    const response = await getAllPhones();
    console.log('Response getAllPhones:', response);
    return response.data || response;
  } catch (error) {
    console.error('Erreur getAllPhones:', error);
    return [];
  }
};

const AllEcrants = async () => {
  try {
    const response = await getAllEcrants();
    console.log('Response getAllEcrants:', response);
    return response.data || response;
  } catch (error) {
    console.error('Erreur getAllEcrants:', error);
    return [];
  }
};

function Myassets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous');
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.user.id;

  // Types d'équipements avec leurs icônes
  const assetTypes = {
    ordinateur: { icon: Computer, label: 'Ordinateurs', service: AllComputers },
    imprimante: { icon: Printer, label: 'Imprimantes', service: AllPrinters },
    telephone: { icon: Phone, label: 'Téléphones', service: AllPhones },
    ecran: { icon: Monitor, label: 'Écrans', service: AllEcrants }
  };

  // Récupérer tous les équipements assignés à l'utilisateur
  const fetchMyAssets = async () => {
    setLoading(true);
    try {
      let allAssets = [];
      
      // Récupérer tous les types d'équipements
      for (const [type, config] of Object.entries(assetTypes)) {
        try {
          const data = await config.service();
          console.log(`Données reçues pour ${type}:`, data);
          
          // Vérifier si data existe et est un tableau
          if (data && Array.isArray(data)) {
            const assetsWithType = data
              .filter(asset => asset.assigned_to === currentUserId)
              .map(asset => ({
                ...asset,
                type: type,
                typeLabel: config.label.slice(0, -1) // Enlever le 's' pour le singulier
              }));
            allAssets = [...allAssets, ...assetsWithType];
          } else {
            console.warn(`Données invalides pour ${type}:`, data);
          }
        } catch (serviceError) {
          console.error(`Erreur lors de la récupération des ${type}:`, serviceError);
          // Continuer avec les autres types d'équipements même si un type échoue
        }
      }
      
      setAssets(allAssets);
      console.log("Équipements récupérés:", allAssets);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les équipements selon l'onglet actif
  const getFilteredAssets = () => {
    if (activeTab === 'tous') {
      return assets;
    }
    return assets.filter(asset => asset.type === activeTab);
  };

  useEffect(() => {
    if (currentUserId) {
      fetchMyAssets();
    }
  }, [currentUserId]);

  // Composant pour afficher une carte d'équipement
  const AssetCard = ({ asset }) => {
    const IconComponent = assetTypes[asset.type].icon;
    
    // Fonction pour obtenir le statut en français
    const getStatusLabel = (etat) => {
      const statusLabels = {
        'en_marche': 'En marche',
        'en_panne': 'En panne',
        'en_réparation': 'En réparation'
      };
      return statusLabels[etat] || etat;
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (etat) => {
      const statusColors = {
        'en_marche': 'bg-green-100 text-green-800',
        'en_panne': 'bg-red-100 text-red-800',
        'en_réparation': 'bg-yellow-100 text-yellow-800'
      };
      return statusColors[etat] || 'bg-gray-100 text-gray-800';
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{asset.name}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {asset.typeLabel}
              </span>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(asset.etat)}`}>
            {getStatusLabel(asset.etat)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="w-4 h-4 mr-2" />
            <span className="font-medium">Marque:</span>
            <span className="ml-1">{asset.marque}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">Acheté le:</span>
            <span className="ml-1">{new Date(asset.date_achat).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">Assigné à:</span>
            <span className="ml-1">
              {asset.assigned_to_details?.first_name} {asset.assigned_to_details?.last_name}
            </span>
          </div>

          {/* Informations spécifiques selon le type d'équipement */}
          {asset.type === 'ordinateur' && (
            <>
              {asset.system_exp && (
                <div className="flex items-center text-sm text-gray-600">
                  <Computer className="w-4 h-4 mr-2" />
                  <span className="font-medium">OS:</span>
                  <span className="ml-1">{asset.system_exp}</span>
                </div>
              )}
              {asset.ram && (
                <div className="flex items-center text-sm text-gray-600">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="font-medium">RAM:</span>
                  <span className="ml-1">{asset.ram}</span>
                </div>
              )}
              {asset.rom && (
                <div className="flex items-center text-sm text-gray-600">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="font-medium">ROM:</span>
                  <span className="ml-1">{asset.rom}</span>
                </div>
              )}
            </>
          )}

          {asset.type === 'ecran' && asset.taille && (
            <div className="flex items-center text-sm text-gray-600">
              <Monitor className="w-4 h-4 mr-2" />
              <span className="font-medium">Taille:</span>
              <span className="ml-1">{asset.taille}</span>
            </div>
          )}

          {asset.type === 'telephone' && (
            <>
              {asset.numero && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium">Numéro:</span>
                  <span className="ml-1">{asset.numero}</span>
                </div>
              )}
              {asset.type_telephone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="font-medium">Type:</span>
                  <span className="ml-1">{asset.type_telephone === 'portable' ? 'Portable' : 'Bureau'}</span>
                </div>
              )}
            </>
          )}

          {asset.type === 'imprimante' && asset.type_imprimante && (
            <div className="flex items-center text-sm text-gray-600">
              <Printer className="w-4 h-4 mr-2" />
              <span className="font-medium">Type:</span>
              <span className="ml-1">{asset.type_imprimante}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredAssets = getFilteredAssets();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Équipements</h1>
          <p className="text-gray-600">
            Consultez tous les équipements qui vous sont assignés
          </p>
        </div>

        {/* Onglets de filtrage */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tous')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tous'
                    ? 'border-blue-500 text-blue-600 hover:bg-gray-50 bg-gray-50'
                    : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-grey-100 hover:bg-blue-100 bg-gray-50'
                }`}
              >
                Tous ({assets.length})
              </button>
              {Object.entries(assetTypes).map(([type, config]) => {
                const count = assets.filter(asset => asset.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === type
                        ? 'bg-gray-50 hover:bg-gray-50 border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-gray-300 hover:bg-blue-50 bg-gray-50'
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement de vos équipements...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Computer className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun équipement trouvé
            </h3>
            <p className="text-gray-500">
              {activeTab === 'tous' 
                ? "Vous n'avez aucun équipement assigné pour le moment."
                : `Vous n'avez aucun ${assetTypes[activeTab]?.label.toLowerCase()} assigné.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={`${asset.type}-${asset.id}`} asset={asset} />
            ))}
          </div>
        )}

        {/* Résumé */}
        {!loading &&(
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(assetTypes).map(([type, config]) => {
                const count = assets.filter(asset => asset.type === type).length;
                const IconComponent = config.icon;
                return (
                  <div key={type} className="text-center">
                    <div className="p-3 bg-gray-50 rounded-lg mb-2 inline-block">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-500">{config.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Myassets;