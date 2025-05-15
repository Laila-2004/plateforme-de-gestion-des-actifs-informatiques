import { BarChart3, PieChart, LineChart, Activity, AlertCircle, Clock, CheckCircle } from 'lucide-react';
export default function TicketStats({tickets}){
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'ouvert').length,
        inProgress: tickets.filter(t => t.status === 'en_cours').length,
        closed: tickets.filter(t => t.status === 'fermé').length,
        critical: tickets.filter(t => t.priority === 'critique').length,
        high: tickets.filter(t => t.priority === 'haute').length,
        medium: tickets.filter(t => t.priority === 'moyenne').length,
        low: tickets.filter(t => t.priority === 'faible').length,
        byCategory: {
          reseau: tickets.filter(t => t.category === 'reseau').length,
          materiel: tickets.filter(t => t.category === 'materiel').length,
          logiciel: tickets.filter(t => t.category === 'logiciel').length,
          securite: tickets.filter(t => t.category === 'securite').length,
          compte: tickets.filter(t => t.category === 'compte').length,
          autre: tickets.filter(t => t.category === 'autre').length,
        },
        byType: {
          incident: tickets.filter(t => t.type_ticket === 'incident').length,
          demande: tickets.filter(t => t.type_ticket === 'demande').length,
          maintenance: tickets.filter(t => t.type_ticket === 'maintenance').length,
        }
      };
    return(
        <div>
        {/* Tableau de bord */}
        <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm uppercase">Total des tickets</h3>
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm uppercase">Tickets ouverts</h3>
              <AlertCircle className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.open}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm uppercase">En cours</h3>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm uppercase">Tickets critiques</h3>
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.critical}</p>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Par statut */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Par statut</h3>
              <PieChart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  Ouvert
                </span>
                <span className="font-semibold">{stats.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  En cours
                </span>
                <span className="font-semibold">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Fermé
                </span>
                <span className="font-semibold">{stats.closed}</span>
              </div>
            </div>
          </div>
          
          {/* Par priorité */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Par priorité</h3>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                  Critique
                </span>
                <span className="font-semibold">{stats.critical}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                  Haute
                </span>
                <span className="font-semibold">{stats.high}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Moyenne
                </span>
                <span className="font-semibold">{stats.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Faible
                </span>
                <span className="font-semibold">{stats.low}</span>
              </div>
            </div>
          </div>
          
          {/* Par type */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Par type</h3>
              <LineChart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  Incident
                </span>
                <span className="font-semibold">{stats.byType.incident || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Demande
                </span>
                <span className="font-semibold">{stats.byType.demande || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Maintenance
                </span>
                <span className="font-semibold">{stats.byType.maintenance || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Par catégorie */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Par catégorie</h3>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Réseau
                </span>
                <span className="font-semibold">{stats.byCategory.reseau || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Matériel
                </span>
                <span className="font-semibold">{stats.byCategory.materiel || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  Logiciel
                </span>
                <span className="font-semibold">{stats.byCategory.logiciel || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  Sécurité
                </span>
                <span className="font-semibold">{stats.byCategory.securite || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  Compte
                </span>
                <span className="font-semibold">{stats.byCategory.compte || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                  Autre
                </span>
                <span className="font-semibold">{stats.byCategory.autre || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}