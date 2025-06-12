import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { AlertTriangle, TrendingUp, Shield, RefreshCw, Activity, Calendar, Wrench, Target } from 'lucide-react';
import instance from '../../services/api/axiosConfig';
import HighRiskAssetsDashboard from '../../components/analytics/HighRiskAssetsDashboard';
import MaintenancePredictionDashboard from '../../components/analytics/MaintenancePredictionDashboard';



export default function PanneDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [highRiskAssets, setHighRiskAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Statistics calculations
  const totalPredictions = predictions.length;
  const highRiskCount = highRiskAssets.length;
  const averageRisk = predictions.reduce((acc, pred) => acc + pred.probability, 0) / totalPredictions;

  // Data for charts
  const riskDistributionData = [
    { name: 'Faible Risque', value: predictions.filter(p => p.probability < 0.4).length, color: '#10B981' },
    { name: 'Risque Moyen', value: predictions.filter(p => p.probability >= 0.4 && p.probability < 0.7).length, color: '#F59E0B' },
    { name: 'Haut Risque', value: predictions.filter(p => p.probability >= 0.7).length, color: '#EF4444' },
  ];

  const issueTypesData = predictions.reduce((acc, pred) => {
    const existing = acc.find(item => item.name === pred.predicted_issue);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: pred.predicted_issue, count: 1 });
    }
    return acc;
  }, []);


  const fetchPredictions = async () => {
    try{    
        const response = await instance.get('predictions/');
        setPredictions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des prédictions:', error);

    }};

    // For fetching high-risk assets
    const fetchHighRiskAssets = async () => {
    try{const response = await instance.get('predictions/high_risk_assets/');
    setHighRiskAssets(response.data);
    }catch (error) {
        console.error('Erreur lors de la récupération des actifs à haut risque:', error);
    }
    };

    useEffect(() => {   
        fetchPredictions();
        fetchHighRiskAssets();
    }, []);

  const handleUpdatePredictions = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await instance.post('predictions/update_predictions/');
      setTimeout(() => {
        setLastUpdate(new Date());
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Tableau de Bord des Prédictions de Pannes
              </h1>
              <p className="text-gray-600">
                Surveillance et analyse prédictive de la maintenance
              </p>
            </div>
            <button
              onClick={handleUpdatePredictions}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 w-32"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Mise à jour...' : 'Actualiser'}
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Prédictions</p>
                <p className="text-3xl font-bold text-gray-900">{totalPredictions}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Actifs à Haut Risque</p>
                <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Risque Moyen</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {(averageRisk * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Prédictions Aujourd'hui</p>
                <p className="text-3xl font-bold text-green-600">
                  {predictions.filter(p => p.prediction_date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Distribution des Risques</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Issue Types Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Types de Pannes Prédites</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={issueTypesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Assets Alert */}
        {highRiskCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">
                Alerte: {highRiskCount} Actif(s) à Haut Risque
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highRiskAssets.map((asset) => (
                <div key={asset.id} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-900">{asset.asset_name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{asset.predicted_issue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">
                      Risque: {(asset.probability * 100).toFixed(1)}%
                    </span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${asset.probability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Components */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <HighRiskAssetsDashboard/>
              
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <MaintenancePredictionDashboard />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}