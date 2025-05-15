import React, { useState, useEffect, useContext } from 'react';
import { 
  getAllTickets, 
  createTicket,
} from '../../services/api/ticketService';
import { getAllComputers,getAllEcrants,getAllPhones,getAllPrinters } from '../../services/api/materielService';
import { useAuth } from '../../context/AuthContext';
import TicketForm from '../../components/tickets/ticketForm';
import TicketDetailsModal from '../../components/tickets/ticketDetails';
// import { FaPlus, FaSearch, FaFilter, FaTimes, FaEye, FaTrash } from 'react-icons/fa';
import { Plus, Search, Filter,XCircle, Eye, Trash2 } from 'lucide-react';

export default function UserTicketManagement() {
  // États
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assetType, setAssetType] = useState('ordinateur');
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [showFilters, setShowFilters] = useState(false);

  const { currentUser } = useAuth();
  // Formulaire initial pour la création d'un ticket
  const initialFormData = {
    title: '',
    status: 'ouvert',
    priority: 'moyenne',
    category: 'logiciel',
    type_ticket: 'incident',
    description: '',
    assigned_to: null,
    asset: null,
    created_by: currentUser?.user.id || '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Récupération des tickets de l'utilisateur
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setIsLoading(true);
        const allTickets = await getAllTickets();
        const data = allTickets.filter(
            (ticket) => ticket.created_by === currentUser?.user.id
        );
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        setError('Erreur lors du chargement des tickets');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.user.id) {
      fetchUserTickets();
    }
  }, [currentUser?.user ]);

  useEffect(() => {
      fetchAssets();
    }, [assetType]);
    
   const fetchAssets = async () => {
      try {
        let Data = [];
        let assetsData=[];
        switch (assetType) {
          case 'ordinateur':
            Data = await getAllComputers();
            assetsData= Data.filter((asset)=>asset.assigned_to===currentUser?.user.id);
            break;
          case 'imprimante':
            Data = await getAllPrinters();
            assetsData= Data.filter((asset)=>asset.assigned_to===currentUser?.user.id);
            break;
          case 'telephone':
            Data = await getAllPhones();
            assetsData= Data.filter((asset)=>asset.assigned_to===currentUser?.user.id);
            break;
          case 'ecran':
            Data = await getAllEcrants();
            assetsData= Data.filter((asset)=>asset.assigned_to===currentUser?.user.id);
            break;
          default:
            assetsData = [];
        }
        
        setAssets(assetsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements:", error);
      }
    };


  // Filtrage des tickets
  useEffect(() => {
    let result = [...tickets];

    // Filtrer par terme de recherche
    if (searchTerm) {
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (statusFilter !== 'tous') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [searchTerm, statusFilter, tickets]);

  // Gestionnaires d'événements
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

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const newTicketData = {
        ...formData,
        created_by: currentUser?.user.id,
      };
      
      const newTicket = await createTicket(newTicketData);
      
      // Ajouter le nouveau ticket à la liste des tickets
      setTickets(prev => [newTicket, ...prev]);
      
      // Réinitialiser le formulaire et fermer la modal
      setFormData(initialFormData);
      setShowTicketForm(false);
      
    } catch (err) {
      setError('Erreur lors de la création du ticket');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(tickets.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
    setSelectedTicket(updatedTicket);
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const closeTicketDetails = () => {
    setShowTicketDetails(false);
    setSelectedTicket(null);
  };

  // Classes conditionnelles pour les badges de statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'ouvert':
        return 'bg-blue-100 text-blue-800';
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'fermé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Traductions pour l'affichage
  const translateStatus = (status) => {
    const statusMap = {
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      fermé: 'Fermé',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes tickets</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      <div className='flex justify-end'>
        <button
          onClick={() => setShowTicketForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center w-48 mb-6 "
        >
          <Plus className="mr-2" /> Nouveau ticket
        </button>
      </div>
       


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
       
        <div className="flex flex-col md:flex-row gap-2 md:items-center w-full ">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="  Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded "
            />
            <Search className="absolute left-3 top-3 text-gray-400" /> 
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 px-1 py-1 text-gray-400 hover:text-gray-600 bg-white hover:bg-red-300 w-10  flex justify-center items-center"
              >
                <XCircle  className="h-4 w-4"/>
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded w-32"
          >
            <Filter className="mr-2" /> Filtres
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 mb-6 rounded-md">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded p-2"
              >
                <option value="tous">Tous les statuts</option>
                <option value="ouvert">Ouvert</option>
                <option value="en_cours">En cours</option>
                <option value="fermé">Fermé</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'tous'
              ? "Aucun ticket ne correspond à votre recherche."
              : "Vous n'avez pas encore créé de tickets."}
          </p>
          {(searchTerm || statusFilter !== 'tous') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('tous');
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière mise à jour
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{ticket.id} - {ticket.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {translateStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.category === 'reseau' && 'Problème Réseau'}
                    {ticket.category === 'materiel' && 'Problème Matériel'}
                    {ticket.category === 'logiciel' && 'Problème Logiciel'}
                    {ticket.category === 'securite' && 'Problème de Sécurité'}
                    {ticket.category === 'compte' && 'Problème de Compte'}
                    {ticket.category === 'autre' && 'Autre'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.opening_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Ici vous pourriez ajouter la date de dernière mise à jour si disponible */}
                    {formatDate(ticket.status === 'fermé' ? ticket.close_date : ticket.opening_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openTicketDetails(ticket)}
                        className="text-blue-600 hover:text-blue-900 bg-white hover:bg-blue-300 flex justify-center items-center"
                        title="Voir les détails"
                      >
                        <Eye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal pour créer un ticket */}
      {showTicketForm && (
        <TicketForm
          currentUser={currentUser.user}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleTicketSubmit}
          handleAssetTypeChange={handleAssetTypeChange}
          assetType={assetType}
          assets={assets}
          technicians={[]} 
          onClose={() => setShowTicketForm(false)}
          isEditing={false}
        />
      )}

      {/* Modal pour afficher les détails d'un ticket */}
      {showTicketDetails && selectedTicket && (
        <TicketDetailsModal
          currentUser={currentUser.user}
          ticket={selectedTicket}
          onClose={closeTicketDetails}
          onTicketUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}