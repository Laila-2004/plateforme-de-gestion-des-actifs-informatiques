import React, { useState } from 'react';
import { updateTicket } from '../../services/api/ticketService';
import TicketComments from '../../components/tickets/ticketComments';

export default function TicketDetailsModal({ 
  ticket, 
  onClose, 
  onTicketUpdate , currentUser
}) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ ...ticket });
console.log('hi');
console.log(currentUser);

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

  const translateCategory = (category) => {
    const categoryMap = {
      reseau: 'Problème Réseau',
      materiel: 'Problème Matériel',
      logiciel: 'Problème Logiciel',
      securite: 'Problème de Sécurité',
      compte: 'Problème de Compte',
      autre: 'Autre',
    };
    return categoryMap[category] || category;
  };

  const translateTicketType = (type) => {
    const typeMap = {
      incident: 'Incident',
      demande: 'Demande',
      maintenance: 'Maintenance Préventive',
    };
    return typeMap[type] || type;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status' && value === 'fermé') {
      const currentDate = new Date().toISOString().split('T')[0];
      setFormData({
        ...formData,
        status: value,
        close_date: currentDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatableFields = {
        status: formData.status,
        description: formData.description,
        priority: formData.priority,
      };
      
      if (formData.status === 'fermé') {
        updatableFields.close_date = formData.close_date;
      }

      const updatedTicket = await updateTicket(ticket.id, updatableFields);
      onTicketUpdate(updatedTicket);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6">
       

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Ticket #{ticket.id} - {ticket.title}
          </h2>
          <div className='flex items-center space-x-2'>
          
          { currentUser.role == "admin" || currentUser.role == 'technicien' && (
            <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {editMode ? 'Annuler' : 'Modifier'}
            </button>
           )}
           <button 
          onClick={onClose} 
          className=" right-4 py-1 text-gray-600 hover:text-gray-900 w-10 bg-white hover:bg-red-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="fermé">Fermé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>

              {formData.status === 'fermé' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fermeture
                  </label>
                  <input
                    type="date"
                    name="close_date"
                    value={formData.close_date?.split('T')[0] || new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Créé par
                </h3>

                {ticket.created_by ? (
                  <div className="text-sm text-gray-800 space-y-1">
                    <p className="font-medium">
                      {ticket.created_by_details.first_name} {ticket.created_by_details.last_name}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold text-blue-600">Service:</span>{' '}
                      {ticket.created_by_details.service_details.name}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold text-green-600">Département:</span>{' '}
                      {ticket.created_by_details.service_details.department_details.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">Non spécifié</p>
                )}
              </div>


              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Date d'ouverture</h3>
                <p className="mt-1">{formatDate(ticket.opening_date)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {translateStatus(ticket.status)}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Priorité</h3>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(
                      ticket.priority
                    )}`}
                  >
                    {translatePriority(ticket.priority)}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                <p className="mt-1">{translateCategory(ticket.category)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Type de ticket</h3>
                <p className="mt-1">{translateTicketType(ticket.type_ticket)}</p>
              </div>

              {ticket.asset && (
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">
                    Équipement concerné
                  </h3>
                  <p className="mt-1">
                    <span className="text-sm text-gray-600">Nom: </span>{' '}
                    {ticket.asset_details.name}{' '}
                    <span className="text-sm text-gray-600">Marque: </span>{' '}
                    {ticket.asset_details.marque}
                  </p>
                </div>
              )}

              {ticket.status === 'fermé' && (
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Date de fermeture</h3>
                  <p className="mt-1">{formatDate(ticket.close_date)}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>

            <div className="mt-6">
              <TicketComments 
                ticketId={ticket.id} 
                ticketStatus={ticket.status} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}