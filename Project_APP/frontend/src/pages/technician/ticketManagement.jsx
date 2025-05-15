import React, { useState, useEffect } from 'react';
import { getAllTickets, updateTicket, getTicketById } from '../../services/api/ticketService';
import { useAuth } from '../../context/AuthContext';
import TicketDetailsModal from '../../components/tickets/ticketDetails';

export default function TicketsManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { currentUser } = useAuth();
  const currentTechnicienId = currentUser?.user.id;

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const allTickets = await getAllTickets();
        const assignedTickets = allTickets.filter(
          (ticket) => ticket.assigned_to === currentTechnicienId
        );
        setTickets(assignedTickets);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, [currentTechnicienId]);

  // Filtrer les tickets en fonction du statut sélectionné
  const filteredTickets = statusFilter
    ? tickets.filter((ticket) => ticket.status === statusFilter)
    : tickets;

  const handleTicketSelect = async (ticketId) => {
    try {
      setLoading(true);
      const ticketDetails = await getTicketById(ticketId);
      setSelectedTicket(ticketDetails);
    } catch (err) {
      setError(`Erreur lors de la récupération du ticket #${ticketId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
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

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critique':
        return 'bg-red-100 text-red-800';
      case 'haute':
        return 'bg-orange-100 text-orange-800';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'faible':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ouvert':
        return 'bg-blue-100 text-blue-800';
      case 'en_cours':
        return 'bg-purple-100 text-purple-800';
      case 'fermé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status) => {
    const statusMap = {
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      fermé: 'Fermé',
    };
    return statusMap[status] || status;
  };

  const translatePriority = (priority) => {
    const priorityMap = {
      faible: 'Faible',
      moyenne: 'Moyenne',
      haute: 'Haute',
      critique: 'Critique',
    };
    return priorityMap[priority] || priority;
  };

  return (
    <div>
      <h1>Gestion des tickets assignés</h1>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-4">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut:
            </label>
            <select
              id="statusFilter"
              className="w-full p-2 border rounded"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">Tous les statuts</option>
              <option value="ouvert">Ouvert</option>
              <option value="en_cours">En cours</option>
              <option value="fermé">Fermé</option>
            </select>
          </div>
          <h2 className="text-lg font-semibold mb-4">Mes tickets</h2>

          {loading && !tickets.length ? (
            <p className="text-gray-500">Chargement des tickets...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-gray-500">Aucun ticket assigné avec ce statut.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className={`py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleTicketSelect(ticket.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">#{ticket.id} - {ticket.title}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(ticket.status)}`}
                    >
                      {translateStatus(ticket.status)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(ticket.priority)}`}
                    >
                      {translatePriority(ticket.priority)}
                    </span>
                    <span className="text-gray-500">{formatDate(ticket.opening_date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailsModal 
          currentUser={currentUser.user}
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)}
          onTicketUpdate={(updatedTicket) => {
            setTickets(tickets.map(ticket => 
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            ));
          }}
        />
      )}
    </div>
  );
}