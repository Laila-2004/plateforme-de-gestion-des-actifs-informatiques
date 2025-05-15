import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, AlertCircle, Clock, User, Laptop } from 'lucide-react';
import TicketDetailsModal from './ticketDetails'; // Assurez-vous d'importer le composant de modal

export default function TicketsTable({ tickets, loading, openEditModal, openDeleteModal,currentUser }) {
  // Nouvel état pour gérer le ticket sélectionné
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critique': return 'bg-red-600 text-white';
      case 'haute': return 'bg-orange-500 text-white';
      case 'moyenne': return 'bg-blue-500 text-white';
      case 'faible': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ouvert': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'en_cours': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'fermé': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  // Mapper les libellés des statuts
  const statusLabels = {
    'ouvert': 'Ouvert',
    'en_cours': 'En cours',
    'fermé': 'Fermé'
  };

  // Mapper les libellés des priorités
  const priorityLabels = {
    'faible': 'Faible',
    'moyenne': 'Moyenne',
    'haute': 'Haute',
    'critique': 'Critique'
  };
  
  // Mapper les libellés des catégories
  const categoryLabels = {
    'reseau': 'Problème Réseau',
    'materiel': 'Problème Matériel',
    'logiciel': 'Problème Logiciel',
    'securite': 'Problème de Sécurité',
    'compte': 'Problème de Compte',
    'autre': 'Autre'
  };
  
  // Mapper les libellés des types de tickets
  const typeLabels = {
    'incident': 'Incident',
    'demande': 'Demande',
    'maintenance': 'Maintenance Préventive'
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString(); // affiche date + heure
  };  

  // Gère l'ouverture du modal de détails
  const handleTicketDetailsOpen = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Gère la fermeture du modal de détails
  const handleTicketDetailsClose = () => {
    setSelectedTicket(null);
  };

  // Gère la mise à jour du ticket
  const handleTicketUpdate = (updatedTicket) => {
    // Vous pouvez implémenter la logique de mise à jour du ticket ici
    // Par exemple, mettre à jour la liste des tickets ou appeler une fonction de mise à jour
    console.log('Ticket mis à jour:', updatedTicket);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Chargement des tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-600">Aucun ticket trouvé</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'ouverture</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fermeture</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé par</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actif concerné</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    #{ticket.id}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {ticket.title}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap"
                  >
                    <div className="flex items-center">
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1.5 text-sm text-gray-900">{statusLabels[ticket.status]}</span>
                    </div>
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap"
                  >
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {priorityLabels[ticket.priority]}
                    </span>
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {categoryLabels[ticket.category]}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {typeLabels[ticket.type_ticket]}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 text-sm text-gray-900"
                  >
                    <div className="max-w-xs truncate">{ticket.description || '-'}</div>
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatDate(ticket.opening_date)}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatDate(ticket.close_date)}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      {ticket?.created_by_details?.username || '-'}
                    </div>
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap"
                  >
                    {ticket.assigned_to ? (
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="h-4 w-4 text-gray-500 mr-1" />
                        {ticket.assigned_to_details?.username}
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(ticket);
                        }}
                        title="Modifier"
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Non assigné
                      </button>
                    )}
                  </td>
                  <td 
                    onClick={() => handleTicketDetailsOpen(ticket)} 
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {ticket.asset ? (
                      <div className="flex items-center">
                        <Laptop className="h-4 w-4 text-gray-500 mr-1" />
                        {ticket.asset_details?.name} ({ticket.asset_details?.marque})
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(ticket);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3 w-9 bg-white hover:bg-blue-300 "
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5 ite" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(ticket);
                      }}
                      className="text-red-600 hover:text-red-900 w-9 bg-white hover:bg-red-300"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails de ticket */}
      {selectedTicket && (
        <TicketDetailsModal
          currentUser={currentUser}
          ticket={selectedTicket}
          onClose={handleTicketDetailsClose}
          onTicketUpdate={handleTicketUpdate}
        />
      )}
    </>
  );
}