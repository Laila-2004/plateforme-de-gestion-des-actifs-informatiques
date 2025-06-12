import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { getAllTickets, createTicket, updateTicket, deleteTicket } from '../../services/api/ticketService';
import { getAllUsers } from '../../services/api/userService';
import { getAllComputers, getAllEcrants, getAllPhones, getAllPrinters,getAllLogiciels,getAllPeripheriques,getAllRouteurs,getAllServeurs,getAllStockagesExterne } from '../../services/api/materielService';
import { useAuth } from '../../context/AuthContext';
import TicketsTable from '../../components/tickets/ticketTable';
import TicketForm from '../../components/tickets/ticketForm';
import TicketStats from '../../components/tickets/ticketStats';

export default function TicketDashboard() {
  // États principaux
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('tickets');
  const [technicians, setTechnicians] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetType, setAssetType] = useState('ordinateur');
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mise à jour automatique du created_by quand currentUser change
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        created_by: currentUser.user.id
      }));
    }
  }, [currentUser]);

  // Récupérer tous les tickets au chargement
  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let result = [...tickets];
    
    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(term) || 
        ticket.description.toLowerCase().includes(term)
      );
    }
    
    // Filtres
    if (filterStatus) {
      result = result.filter(ticket => ticket.status === filterStatus);
    }
    if (filterPriority) {
      result = result.filter(ticket => ticket.priority === filterPriority);
    }
    if (filterCategory) {
      result = result.filter(ticket => ticket.category === filterCategory);
    }
    
    setFilteredTickets(result);
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);
  
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

  // Récupérer le matériel
  const fetchAssets = async () => {
    try {
      let assetsData = [];
      
      switch (assetType) {
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
        case 'logiciel':
          assetsData = await getAllLogiciels();
          break;
        case 'peripherique':
          assetsData = await getAllPeripheriques();
          break;
        case 'routeur':
          assetsData = await getAllRouteurs();
          break;
        case 'serveur':
          assetsData = await getAllServeurs();
          break;
        case 'stockage_externe':
          assetsData = await getAllStockagesExterne();
          break;
        default:
          assetsData = [];
      }
      
      setAssets(assetsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
    }
  };

  // Fonction pour charger les équipements selon le type
  useEffect(() => {
    fetchAssets();
  }, [assetType]);

  // Récupérer les tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllTickets();
      setTickets(data);
      setFilteredTickets(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des tickets");
      console.error(err);
    } finally {
      setLoading(false);
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

  // Ajouter un ticket
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

  // Modifier un ticket
  const handleEditTicket = async (e) => {
    e.preventDefault();
    try {
      await updateTicket(currentTicket.id, formData);
      setShowEditModal(false);
      resetForm();
      fetchTickets();
    } catch (err) {
      setError("Erreur lors de la modification du ticket");
      console.error(err);
    }
  };

  // Supprimer un ticket
  const handleDeleteTicket = async () => {
    try {
      await deleteTicket(currentTicket.id);
      setShowDeleteModal(false);
      fetchTickets();
    } catch (err) {
      setError("Erreur lors de la suppression du ticket");
      console.error(err);
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      type_ticket: ticket.type_ticket,
      description: ticket.description,
      assigned_to: ticket.assigned_to,
      asset: ticket.asset,
    });
    setShowEditModal(true);
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (ticket) => {
    setCurrentTicket(ticket);
    setShowDeleteModal(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Système de Gestion des Tickets</h1>
        </div>
      </header>

      {/* Onglets */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex border-b">
            <button 
              className={`px-4 py-4 font-medium ${activeTab === 'tickets' ? 'text-green-600 border-b-2 border-green-600 bg-green-400 hover:bg-green-200' : 'text-gray-600 bg-white hover:bg-green-200'}`}
              onClick={() => setActiveTab('tickets')}
            >
              Tickets
            </button>
            <button 
              className={`px-4 py-4 font-medium ${activeTab === 'dashboard' ? 'text-green-600 border-b-2 border-green-600 bg-green-400 hover:bg-green-200' : 'text-gray-600 bg-white hover:bg-green-200'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Tableau de Bord
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'tickets' ? (
          <div>
            {/* Barre d'outils */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher des tickets..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <select 
                  className="p-2 border rounded-lg"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="fermé">Fermé</option>
                </select>
                
                <select 
                  className="p-2 border rounded-lg"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">Toutes les priorités</option>
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
                
                <select 
                  className="p-2 border rounded-lg"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  <option value="reseau">Problème Réseau</option>
                  <option value="materiel">Problème Matériel</option>
                  <option value="logiciel">Problème Logiciel</option>
                  <option value="securite">Problème de Sécurité</option>
                  <option value="compte">Problème de Compte</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
            </div>
            <div className='flex justify-end mb-5'>
            <button 
                onClick={() => setShowAddModal(true)}
                className=" bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 w-1/4 "
              >
                <Plus className="h-5 w-5" />
                Nouveau Ticket
            </button>

            </div>
            
            <TicketsTable 
              currentUser={currentUser.user}
              tickets={filteredTickets} 
              loading={loading} 
              openEditModal={openEditModal} 
              openDeleteModal={openDeleteModal}
            />
          </div>
        ) : (
          <TicketStats tickets={tickets} />
        )}
      </main>

      {/* Modals pour ajouter/éditer/supprimer des tickets */}
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

      {showEditModal && currentTicket && (
        <TicketForm 
          currentUser={currentUser.user}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleEditTicket}
          handleAssetTypeChange={handleAssetTypeChange}
          assetType={assetType}
          assets={assets}
          technicians={technicians}
          onClose={() => setShowEditModal(false)}
          isEditing={true}
          ticketId={currentTicket.id}
        />
      )}

      {showDeleteModal && currentTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer le ticket #{currentTicket.id} - {currentTicket.title}?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteTicket}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}