// Service Detail Modal Component
import { 
    Search, 
    X, 
    Plus, 
    ChevronDown, 
    Users, 
    Settings, 
    Bell, 
    Edit2, 
    Trash2, 
    Save, 
    Check
  } from "lucide-react";
function ServiceDetailModal({ service, users, onClose, onEdit, onDelete }) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onEdit}
                className="p-1 hover:bg-gray-100 rounded text-blue-600 bg-white "
                title="Modifier"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={onDelete}
                className="p-1 hover:bg-red-100 rounded text-red-600 bg-white "
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-100 focus:outline-none bg-white hover:grey-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description du service</h4>
              <p className="text-gray-600">
                {service.description || "Aucune description disponible pour ce service."}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Membres de l'équipe ({users.length})
              </h4>
              {users.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user.id} className="py-3 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500">{user.role || "Membre de l'équipe"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucun membre d'équipe assigné à ce service.</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={onClose}
            >
              Fermer
            </button>
            <button 
              onClick={onEdit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Modifier le service
            </button>
          </div>
        </div>
      </div>
    );
  }
  export default ServiceDetailModal;