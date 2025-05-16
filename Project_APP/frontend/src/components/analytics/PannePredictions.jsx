import React, { useEffect, useState } from 'react';
import instance from '../../services/api/axiosConfig';
import { AlertCircle, CheckCircle, RefreshCw, AlertTriangle, Search, BarChart2 } from 'lucide-react';

const PannePredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null); // ID de l'équipement en cours de prédiction
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'probability', direction: 'desc' });

  useEffect(() => {
    fetchPredictions();
    
    // Nettoyage des notifications après 5 secondes
    const timer = setTimeout(() => {
      if (notification) setNotification(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await instance.get('predictions/');
      setPredictions(res.data);
      setError(null);
    } catch (err) {
      console.error('Erreur de chargement:', err);
      setError('Erreur lors du chargement des prédictions.');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (assetId, assetName) => {
    setProcessing(assetId);
    try {
      await instance.post(`predict_panne/${assetId}/`);
      setNotification({ 
        type: 'success', 
        message: `Prédiction réussie pour ${assetName}!` 
      });
      fetchPredictions();
    } catch (err) {
      console.error('Erreur de prédiction:', err);
      setNotification({ 
        type: 'error', 
        message: `Échec de la prédiction pour ${assetName}.` 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusColor = (probability) => {
    if (probability >= 0.7) return 'bg-red-100 text-red-800';
    if (probability >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (probability) => {
    if (probability >= 0.7) return <AlertCircle className="w-4 h-4 inline mr-1" />;
    if (probability >= 0.4) return <AlertTriangle className="w-4 h-4 inline mr-1" />;
    return <CheckCircle className="w-4 h-4 inline mr-1" />;
  };

  // Filtrage et tri des prédictions
  const filteredAndSortedPredictions = predictions
    .filter(p => 
      p.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.predicted_issue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === 'prediction_date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.prediction_date) - new Date(b.prediction_date)
          : new Date(b.prediction_date) - new Date(a.prediction_date);
      }
      
      if (sortConfig.key === 'probability') {
        return sortConfig.direction === 'asc' 
          ? a.probability - b.probability 
          : b.probability - a.probability;
      }
      
      if (sortConfig.key === 'asset_name' || sortConfig.key === 'predicted_issue') {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
      
      return 0;
    });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center min-h-60">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-2" />
          <p className="text-gray-600">Chargement des prédictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart2 className="mr-2" /> Prédictions de Pannes
          </h2>
          <button 
            onClick={fetchPredictions} 
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {notification && (
          <div className={`p-3 rounded mb-4 flex items-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? 
              <CheckCircle className="w-5 h-5 mr-2" /> : 
              <AlertCircle className="w-5 h-5 mr-2" />
            }
            {notification.message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-800 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </header>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par matériel ou problème..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredAndSortedPredictions.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('asset_name')}
                >
                  Matériel {getSortIndicator('asset_name')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('predicted_issue')}
                >
                  Problème {getSortIndicator('predicted_issue')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('probability')}
                >
                  Probabilité {getSortIndicator('probability')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('prediction_date')}
                >
                  Date {getSortIndicator('prediction_date')}
                </th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedPredictions.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.asset_name}</td>
                  <td className="px-4 py-3">{p.predicted_issue}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(p.probability)}`}>
                      {getStatusIcon(p.probability)}
                      {(p.probability * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(p.prediction_date)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePredict(p.asset_details.id, p.asset_name)}
                      disabled={processing === p.asset_details.id}
                      className={`
                        px-3 py-1 rounded text-white flex items-center
                        ${processing === p.asset_details.id 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'}
                      `}
                    >
                      {processing === p.asset_details.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Mettre à jour
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          {searchTerm ? (
            <div className="text-gray-600">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Aucun résultat pour "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-500 hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          ) : (
            <div className="text-gray-600">
              <BarChart2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Aucune prédiction de panne disponible pour le moment.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-right text-sm text-gray-600">
        {filteredAndSortedPredictions.length} résultat(s) trouvé(s)
      </div>
    </div>
  );
};

export default PannePredictions;