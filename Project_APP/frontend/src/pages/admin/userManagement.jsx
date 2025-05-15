import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/api/userService';
import { getAllDepartments } from '../../services/api/departmentService';
import { getAllServices } from '../../services/api/serviceService';
import UserTable from '../../components/users/userTable';
import UserForm from '../../components/users/userForm';
import UserDetails from '../../components/users/userDetails';
import { getAllComputers, getAllPhones, getAllPrinters ,getAllEcrants,updateComputer,updateEcrant,updatePhone,updatePrinter} from '../../services/api/materielService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenD, setModalOpenD] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [computers,setComputers]=useState([]);
  const [phones,setPhones]=useState([]);
  const [printers,setPrinters]=useState([]);
  const [ecrants,setEcrants]=useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFiltered(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const deps = await getAllDepartments();
      setDepartments(deps);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const loadServices = async()=>{
    try{
      const serv = await getAllServices();
      setServices(serv);
    }catch(err){
      console.error('Failed to load Services:',err);
    }
  }
  const loadComputers=async()=>{
    try{
      const comp = await getAllComputers();
      setComputers(comp);
    }catch(err){
      console.error('Failed to load Computers',err);
    }
  }

  const loadPrinters = async () => {
    try {
      const prnt= await getAllPrinters();
      setPrinters(prnt);
    }catch(err){
      console.error('Failed to load Printers',err);
    }
  }
  const loadPhones = async() => {
    try{
      const phons= await getAllPhones();
      setPhones(phons);
    }catch(err){
      console.error('Failed to load Phones',err);
    }
  };

  const loadEcrants = async () => {
    try {
      const ecrans = await getAllEcrants();
      setEcrants(ecrans);
    } catch (err) {
      console.error('Échec du chargement des écrans', err);
    }
  };
  

  useEffect(() => {
    loadUsers();
    loadDepartments();
    loadServices();
    loadComputers();
    loadPrinters();
    loadPhones();
    loadEcrants();
  }, []);

  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => {
      const fieldA = a[sortField] ? a[sortField].toString().toLowerCase() : '';
      const fieldB = b[sortField] ? b[sortField].toString().toLowerCase() : '';
      
      if (sortDirection === 'asc') {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

    setFiltered(
      sortedUsers.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
        (u.service_details && u.service_details.name && u.service_details.name.toLowerCase().includes(search.toLowerCase()))||
        (u.service_details?.department_details && u.service_details?.department_details.name && u.service_details?.department_details.name.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, users, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (form) => {
    try {
      setLoading(true);
  
      const newUserPayload = {
        username: form.username,
        password: form.password,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        role: form.role,
        department: parseInt(form.department, 10), // Conversion en nombre
        service: parseInt(form.service, 10),       // Conversion en nombre
        is_active: form.is_active || true,         // Valeur par défaut si non définie
      };
  
      let createdUser = null;
  
      if (selectedUser) {
        await updateUser(selectedUser.id, newUserPayload);
        createdUser = selectedUser; // si update, l'id est déjà connu
      } else {
        const response = await createUser(newUserPayload);
        createdUser = response; // ⚠️ Assure-toi que createUser() retourne bien l'objet créé avec son id
      }
  
      // ⚠️ Vérifie que createdUser.id existe avant de continuer
      if (createdUser?.id) {
        // Gestion des matériels assignés
        // 1. D'abord, récupérer les matériels actuellement assignés
        if (selectedUser) {
          // Libérer les matériels précédemment assignés qui ne sont plus dans la liste
          const currentComputers = computers.filter(c => c.assigned_to === selectedUser.id);
          const currentPhones = phones.filter(p => p.assigned_to === selectedUser.id);
          const currentPrinters = printers.filter(pr => pr.assigned_to === selectedUser.id);
          const currentEcrants = ecrants.filter(e => e.assigned_to === selectedUser.id);
  
          // Pour chaque type de matériel, vérifier s'il a été retiré
          for (const computer of currentComputers) {
            const stillAssigned = form.assignedMaterials.some(
              m => m.type === 'computer' && (m.id === computer.id || m.id=== computer.id)
            );
            console.log('hi')
            console.log(form.assignedMaterials);
            console.log(stillAssigned);
            if (!stillAssigned) {
              await updateComputer(computer.id, { assigned_to: null });
            }
          }
  
          for (const phone of currentPhones) {
            const stillAssigned = form.assignedMaterials.some(
              m => m.type === 'phone' && (m.id === phone.id || parseInt(m.id, 10) === phone.id)
            );
            if (!stillAssigned) {
              await updatePhone(phone.id, { assigned_to: null });
            }
          }
  
          for (const printer of currentPrinters) {
            const stillAssigned = form.assignedMaterials.some(
              m => m.type === 'printer' && (m.id === printer.id || parseInt(m.id, 10) === printer.id)
            );
            if (!stillAssigned) {
              await updatePrinter(printer.id, { assigned_to: null });
            }
          }
  
          for (const ecrant of currentEcrants) {
            const stillAssigned = form.assignedMaterials.some(
              m => m.type === 'ecrant' && (m.id === ecrant.id || parseInt(m.id, 10) === ecrant.id)
            );
            if (!stillAssigned) {
              await updateEcrant(ecrant.id, { assigned_to: null });
            }
          }
        }
  
        // 2. Assigner les nouveaux matériels ou mettre à jour les existants
        for (const material of form.assignedMaterials) {
          const materialId = material.id
          
          switch(material.type) {
            case 'computer':
              await updateComputer(materialId, { assigned_to: createdUser.id });
              break;
            case 'phone':
              await updatePhone(materialId, { assigned_to: createdUser.id });
              break;
            case 'printer':
              await updatePrinter(materialId, { assigned_to: createdUser.id });
              break;
            case 'ecrant':
              await updateEcrant(materialId, { assigned_to: createdUser.id });
              break;
            default:
              console.warn(`Type de matériel inconnu: ${material.type}`);
          }
        }
      }
  
      setModalOpen(false);
      setSelectedUser(null);
      loadUsers();
  
    } catch (err) {
      setError(`Erreur lors de l'${selectedUser ? 'édition' : 'ajout'} de l'utilisateur`);
      console.error('Failed to save user:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpenD(false); // Close the details modal
    setModalOpen(true);   // Open the form modal
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        setLoading(true);
        await deleteUser(id);
        setSelectedUser(null);
        loadUsers();
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur");
      console.error('Failed to delete user:', err);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des Utilisateurs</h1>
            <div className="flex items-center space-x-4">
            <span className="text-base text-center text-gray-700 bg-green-200 rounded px-8 py-1 font-medium shadow">
              {filtered.length} {filtered.length === 1 ? 'utilisateur' : 'utilisateurs'} 
              {filtered.length !== users.length && ` (sur ${users.length})`}
            </span>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Nouvel Utilisateur</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden">
                <div className="pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou département..."
                  className="w-full px-3 py-2 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="pr-3 text-gray-400 hover:text-gray-600 w-10 bg-white hover:bg-blue-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => loadUsers()}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition bg-white"
                title="Rafraîchir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <UserTable 
            users={filtered} 
            onSelect={user => {
              setSelectedUser(user);
              setModalOpenD(true);
            }}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            loading={loading}
          />
        </div>

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="mt-6 text-center py-10 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? `Aucun résultat pour "${search}"` : "Il n'y a pas encore d'utilisateurs."}
            </p>
            {search && (
              <div className="mt-6">
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User form modal */}
      <UserForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        user={selectedUser}
        departments={departments}
        services={services}
        computers={computers}
        printers={printers}
        ecrants={ecrants}
        phones={phones}
      />
      <UserDetails
        isOpen={modalOpenD}
        onClose={() => {
            setModalOpenD(false);
            setSelectedUser(null);
          }}
        onEdit={handleEditUser}
        user={selectedUser}
        departments={departments}
        services={services}
        phones={phones}
        computers={computers}
        printers={printers}
        ecrants={ecrants}
      />
    </div>
  );
};

export default UserManagement;