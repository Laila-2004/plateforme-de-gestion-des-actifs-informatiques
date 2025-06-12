import { useEffect, useState } from "react";
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from "../../services/api/departmentService";
import { getAllServices, createService, updateService, deleteService } from "../../services/api/serviceService";
import { getAllUsers } from "../../services/api/userService";
import { Search, Plus, Download,} from "lucide-react";
import DepartmentCard from '../../components/departments/DepartmentCard'
import ServiceDetailModal from '../../components/departments/ServiceDetail'
import instance from "../../services/api/axiosConfig";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Department Modal States
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [departmentFormData, setDepartmentFormData] = useState({ name: "", description: "" });
  
  // Service Modal States
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({ 
    name: "", 
    description: "", 
    department: "" 
  });

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [deps, svcs, usrs] = await Promise.all([
        getAllDepartments(),
        getAllServices(),
        getAllUsers()
      ]);
      setDepartments(deps);
      setServices(svcs);
      setUsers(usrs);
    } catch (error) {
      showNotification("Erreur lors du chargement des données", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Department CRUD operations
  const handleAddDepartment = () => {
    setDepartmentFormData({ name: "", description: "" });
    setCurrentDepartment(null);
    setShowDeptModal(true);
  };

  const handleEditDepartment = (dept) => {
    setDepartmentFormData({ name: dept.name, description: dept.description || "" });
    setCurrentDepartment(dept);
    setShowDeptModal(true);
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDepartment) {
        // Update existing department
        await updateDepartment(currentDepartment.id, departmentFormData);
        showNotification("Département modifié avec succès");
      } else {
        // Create new department
        await createDepartment(departmentFormData);
        showNotification("Département ajouté avec succès");
      }
      setShowDeptModal(false);
      loadAllData();
    } catch (error) {
      showNotification("Erreur: " + (error.message || "Opération échouée"), "error");
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce département?")) {
      try {
        await deleteDepartment(id);
        showNotification("Département supprimé avec succès");
        loadAllData();
      } catch (error) {
        showNotification("Erreur lors de la suppression", "error");
      }
    }
  };

  // Service CRUD operations
  const handleAddService = (departmentId) => {
    setServiceFormData({ name: "", description: "", department: departmentId });
    setCurrentService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setServiceFormData({
      name: service.name,
      description: service.description || "",
      department: service.department
    });
    setCurrentService(service);
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService) {
        // Update existing service
        await updateService(currentService.id, serviceFormData);
        showNotification("Service modifié avec succès");
      } else {
        // Create new service
        await createService(serviceFormData);
        showNotification("Service ajouté avec succès");
      }
      setShowServiceModal(false);
      loadAllData();
    } catch (error) {
      showNotification("Erreur: " + (error.message || "Opération échouée"), "error");
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service?")) {
      try {
        await deleteService(id);
        showNotification("Service supprimé avec succès");
        loadAllData();
      } catch (error) {
        showNotification("Erreur lors de la suppression", "error");
      }
    }
  };

  const filteredDepartments = departments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && (activeTab === "favorites" ? d.isFavorite : true);
  });

  const handleDownload = async () => {
    window.open("http://localhost:8000/api/export-departements-services/", "_blank");
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des Départements</h1>
            <div className="flex items-center">
             <span className="text-base text-center text-gray-700 bg-green-200 rounded px-8 py-3 font-medium shadow leading-tight">
              {departments.length} <br />
              {departments.length === 1 ? 'département' : 'départements'}
             </span>
           </div>

          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher un département..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleAddDepartment}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Ajouter un département
            </button>
            <button onClick={handleDownload} className="flex items-center justify-center p-3 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors ">
            <Download className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Exporter</span>
        </button>
          </div>
          
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Department Cards */}
            {filteredDepartments.length > 0 ? (
              <div className="space-y-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((dept) => (
                  <DepartmentCard
                    key={dept.id}
                    department={dept}
                    services={services.filter((s) => s.department === dept.id)}
                    users={users}
                    onServiceClick={setSelectedService}
                    onEditDepartment={handleEditDepartment}
                    onDeleteDepartment={handleDeleteDepartment}
                    onAddService={() => handleAddService(dept.id)}
                    onEditService={handleEditService}
                    onDeleteService={handleDeleteService}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Aucun département trouvé</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Ajustez votre recherche ou ajoutez un nouveau département.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          users={users.filter((u) => u.service === selectedService.id)}
          onClose={() => setSelectedService(null)}
          onEdit={() => {
            setSelectedService(null);
            handleEditService(selectedService);
          }}
          onDelete={() => {
            handleDeleteService(selectedService.id);
            setSelectedService(null);
          }}
        />
      )}

      {/* Department Form Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {currentDepartment ? "Modifier le département" : "Ajouter un département"}
              </h3>
            </div>
            
            <form onSubmit={handleDepartmentSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du département
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentFormData.name}
                    onChange={(e) => setDepartmentFormData({...departmentFormData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={departmentFormData.description}
                    onChange={(e) => setDepartmentFormData({...departmentFormData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {currentDepartment ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {currentService ? "Modifier le service" : "Ajouter un service"}
              </h3>
            </div>
            
            <form onSubmit={handleServiceSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du service
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <select
                    required
                    value={serviceFormData.department}
                    onChange={(e) => setServiceFormData({...serviceFormData, department: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    disabled={currentService !== null}
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {currentService ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Department Card Component


