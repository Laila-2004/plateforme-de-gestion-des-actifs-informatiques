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
import { useState } from "react";
function DepartmentCard({ 
    department, 
    services, 
    users, 
    onServiceClick,
    onEditDepartment,
    onDeleteDepartment,
    onAddService,
    onEditService,
    onDeleteService
  }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const departmentUsers = users.filter(user => 
      services.some(service => service.id === user.service)
    );
    
    const userCount = departmentUsers.length;
    
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {services.length} service{services.length !== 1 ? 's' : ''} • {userCount} utilisateur{userCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="bg-blue-100 h-12 w-12 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {department.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={() => onEditDepartment(department)}
                  className="p-1 hover:bg-blue-300 rounded bg-white "
                >
                  <Edit2 size={16} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => onDeleteDepartment(department.id)}
                  className="p-1 hover:bg-red-300 rounded bg-white"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
          {department.description && (
            <p className="text-sm text-gray-600 mt-2">{department.description}</p>
          )}
        </div>
        
        <div className="px-5 py-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Services</h4>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onAddService(department.id)}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
              >
                <Plus size={14} className="inline mr-1" />
                Ajouter
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-green-600 hover:text-green-800 flex items-center bg-green-300 hover:bg-green-400 w-40 "
              >
                {isExpanded ? "Réduire" : "Voir tout"}
                <ChevronDown 
                  size={16} 
                  className={`ml-1 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} 
                />
              </button>
            </div>
          </div>
          
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {services.length > 0 ? (
              services.slice(0, isExpanded ? services.length : 3).map((service) => (
                <li 
                  key={service.id}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span 
                    className="text-sm text-gray-800 cursor-pointer flex-grow"
                    onClick={() => onServiceClick(service)}
                  >
                    {service.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1 mr-2">
                      {users
                        .filter(u => u.service === service.id)
                        .slice(0, 3)
                        .map((user, i) => (
                          <div 
                            key={user.id} 
                            className="h-6 w-6 rounded-full bg-gray-300 border border-white flex items-center justify-center text-xs font-medium text-gray-800"
                          >
                            {user.name?.charAt(0) || "U"}
                          </div>
                        ))
                      }
                      {users.filter(u => u.service === service.id).length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs font-medium">
                          +{users.filter(u => u.service === service.id).length - 3}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditService(service);
                      }}
                      className="p-1 hover:bg-blue-300 bg-white rounded"
                    >
                      <Edit2 size={14} className="text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteService(service.id);
                      }}
                      className="p-1 hover:bg-red-300 bg-white rounded"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 py-2">Aucun service disponible</li>
            )}
          </ul>
          
          {!isExpanded && services.length > 3 && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full mt-2 text-center text-sm text-blue-600 hover:text-blue-800 py-1 bg-gray-100 hover:bg-gray-200"
            >
              Afficher {services.length - 3} services supplémentaires
            </button>
          )}
        </div>
        
      </div>
    );
  }
  export default DepartmentCard;