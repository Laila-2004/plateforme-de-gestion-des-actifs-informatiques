import { getAllTickets } from "../../services/api/ticketService";
import { useAuth } from "../../context/AuthContext";
import TicketStats from "../../components/tickets/ticketStats";
import { useState, useEffect } from "react";

export default function TechDashboard() {
  const { currentUser } = useAuth();
  
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setIsLoading(true);
        const allTickets = await getAllTickets();
        const data = allTickets.filter(
          (ticket) => ticket.assigned_to === currentUser?.user.id
        );
        setTickets(data);
      } catch (err) {
        setError("Erreur lors du chargement des tickets");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser?.user.id) {
      fetchUserTickets();
    }
  }, [currentUser?.user]);
  
  const handleRetry = () => {
    setError(null);
    const fetchUserTickets = async () => {
      try {
        setIsLoading(true);
        const allTickets = await getAllTickets();
        const data = allTickets.filter(
          (ticket) => ticket.assigned_to === currentUser?.user.id
        );
        setTickets(data);
      } catch (err) {
        setError("Erreur lors du chargement des tickets");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserTickets();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Tableau de bord Technicien
              </h1>
              <p className="mt-2 text-slate-600">
                Bienvenue, {currentUser?.user.name || 'Technicien'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-blue-800">
                  {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} assigné{tickets.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-red-800">
                    Erreur de chargement
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Réessayer
                    </button>
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex items-center px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Ignorer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-slate-600">
              Chargement de vos tickets...
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Veuillez patienter un moment
            </p>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && (
          <div className="space-y-8">
            {/* Stats Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">
                  Statistiques des tickets
                </h2>
              </div>
              <div className="p-6">
                <TicketStats tickets={tickets} />
              </div>
            </div>

            {/* Empty State */}
            {tickets.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Aucun ticket assigné
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Vous n'avez actuellement aucun ticket assigné. 
                  Les nouveaux tickets apparaîtront ici dès qu'ils vous seront attribués.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}