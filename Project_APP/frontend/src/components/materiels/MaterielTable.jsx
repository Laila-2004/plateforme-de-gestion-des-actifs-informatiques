import React, { useEffect, useState } from 'react';
import {
  getAllComputers,getAllEcrants,getAllPrinters,getAllPhones,getAllServeurs,getAllLogiciels,  getAllStockagesExterne,getAllRouteurs,getAllPeripheriques,
  deleteComputer,deleteEcrant,deletePrinter,deletePhone,deleteServeur,deleteLogiciel,deleteStockageExterne,deleteRouteur,deletePeripherique
} from '../../services/api/materielService';
import MaterielForm from './MaterielForm';
import { Trash2, Edit2, Printer,} from "lucide-react";

const MaterielTable = ({ type }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  // État pour le filtre d'affichage
  const [filterBy, setFilterBy] = useState('all');
  // État pour le filtre d'assignation
  const [assignmentFilter, setAssignmentFilter] = useState('all');

  // Convert tab name to material type for API
  const getTypeForApi = () => {
    switch (type) {
      case 'Ordinateurs': return 'Ordinateur';
      case 'Écrans': return 'Ecrant';
      case 'Imprimantes': return 'Impriment';
      case 'Téléphones': return 'Telephone';
      case 'Serveurs': return'Serveur';
      case 'Logiciels':return 'Logiciel';
      case 'Stockages externes':return 'StockageExterne';
      case 'Routeurs': return 'Routeur';
      case 'Périphériques':return 'Peripherique';
      default: return '';
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let result = [];
      switch (type) {
        case 'Ordinateurs':
          result = await getAllComputers();
          break;
        case 'Écrans':
          result = await getAllEcrants();
          break;
        case 'Imprimantes':
          result = await getAllPrinters();
          break;
        case 'Téléphones':
          result = await getAllPhones();
          break;
        case 'Serveurs':
          result = await getAllServeurs();
          break;
        case 'Logiciels':
          result = await getAllLogiciels();
          break; 
        case 'Stockages externes':
          result = await getAllStockagesExterne();
          break;
        case 'Routeurs':
          result = await getAllRouteurs();
          break;
        case 'Périphériques':
          result = await getAllPeripheriques();
          break;

      }
      setData(result || []);
      setFilteredData(result || []);
    } catch (error) {
      console.error(`Erreur lors du chargement des ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      switch (type) {
        case 'Ordinateurs':
          await deleteComputer(id);
          break;
        case 'Écrans':
          await deleteEcrant(id);
          break;
        case 'Imprimantes':
          await deletePrinter(id);
          break;
        case 'Téléphones':
          await deletePhone(id);
          break;
        case 'Serveurs':
          await deleteServeur(id);
          break;
        case 'Logiciels':
          await deleteLogiciel(id);
          break;
        case 'Stockages externes':
          await deleteStockageExterne(id);
          break;
        case 'Routeurs':
          await deleteRouteur(id);
          break;
        case 'Périphériques':
          await deletePeripherique(id);
          break;
      }
      // Refresh the data
      await fetchData();
      // Reset confirm delete state
      setConfirmDelete(null);
    } catch (error) {
      console.error(`Erreur lors de la suppression du ${type.slice(0, -1)}:`, error);
    }
  };

  const handleEdit = (item) => {
    // Convert item to the format expected by the form
    const formattedItem = {
      ...item,
      type: getTypeForApi() // Add the proper type field
    };
    setEditingItem(formattedItem);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleFormSave = (savedItem) => {
    fetchData(); // Refresh the data after saving
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Fonction pour changer le filtre d'assignation
  const handleAssignmentFilterChange = (e) => {
    const newAssignmentFilter = e.target.value;
    setAssignmentFilter(newAssignmentFilter);
    applyFilters(searchTerm, searchBy, filterBy, newAssignmentFilter);
  };

  // Fonction améliorée de recherche
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, searchBy, filterBy, assignmentFilter);
  };

  // Fonction pour changer le champ de recherche
  const handleSearchByChange = (e) => {
    const newSearchBy = e.target.value;
    setSearchBy(newSearchBy);
    applyFilters(searchTerm, newSearchBy, filterBy, assignmentFilter);
  };

  // Fonction pour changer le filtre d'état
  const handleFilterByChange = (e) => {
    const newFilterBy = e.target.value;
    setFilterBy(newFilterBy);
    applyFilters(searchTerm, searchBy, newFilterBy, assignmentFilter);
  };

  // Fonction unifiée pour appliquer les filtres
  const applyFilters = (term = searchTerm, field = searchBy, filter = filterBy, assignmentFilter = assignmentFilter) => {
    // Si aucun terme de recherche et tous les filtres à "tous", afficher toutes les données
    if (!term.trim() && filter === 'all' && assignmentFilter === 'all') {
      setFilteredData(data);
      return;
    }

    // Commencer avec toutes les données
    let filtered = [...data];
    
    // Appliquer le filtre d'état
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.etat === filter);
    }
    
    // Appliquer le filtre d'assignation
    if (assignmentFilter !== 'all') {
      if (assignmentFilter === 'assigned') {
        filtered = filtered.filter(item => item.assigned_to);
      } else if (assignmentFilter === 'stock') {
        filtered = filtered.filter(item => !item.assigned_to);
      }
    }

    // Ensuite, appliquer la recherche textuelle si un terme est fourni
    if (term.trim()) {
      const lowercasedValue = term.toLowerCase().trim();
      
      filtered = filtered.filter(item => {
        // Recherche par champ assigné
        if (field === 'assigned_to') {
          if (!item.assigned_to_details) return false;
          
          const fullName = `${item.assigned_to_details.first_name || ''} ${item.assigned_to_details.last_name || ''}`.toLowerCase();
          return fullName.includes(lowercasedValue);
        }
        
        // Recherche par date
        if (field === 'date_achat' && item.date_achat) {
          const formattedDate = formatDate(item.date_achat);
          return formattedDate.toLowerCase().includes(lowercasedValue);
        }
        
        // Recherche par état (utilisant l'affichage formaté)
        if (field === 'etat') {
          return displayEtat(item.etat).toLowerCase().includes(lowercasedValue);
        }
        
        // Recherche par champ spécifique au type de matériel
        if (field === 'telephone_type' && item.telephone_type) {
          const displayType = item.telephone_type === 'portable' ? 'portable' : 'bureau';
          return displayType.toLowerCase().includes(lowercasedValue);
        }
        
        // Recherche standard pour les autres champs
        if (item[field] !== undefined && item[field] !== null) {
          return item[field].toString().toLowerCase().includes(lowercasedValue);
        }
        
        return false;
      });
    }
    
    setFilteredData(filtered);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setSearchBy('name');
    setFilterBy('all');
    setAssignmentFilter('all');
    setFilteredData(data);
  };

  // Obtenir les options de recherche basées sur le type de matériel
  const getSearchOptions = () => {
    const commonOptions = [
      { value: 'name', label: 'Nom' },
      { value: 'marque', label: 'Marque' },
      { value: 'etat', label: 'État' },
      { value: 'date_achat', label: 'Date d\'achat' },
      { value: 'assigned_to', label: 'Assigné à' },
    ];
    
    // Ajouter des options spécifiques selon le type
    let additionalOptions = [];
    
    switch (type) {
      case 'Ordinateurs':
        additionalOptions = [
          { value: 'system_exp', label: 'Système d\'exploitation' },
          { value: 'ram', label: 'RAM' },
          { value: 'rom', label: 'ROM' }
        ];
        break;
      case 'Écrans':
        additionalOptions = [
          { value: 'taille', label: 'Taille' }
        ];
        break;
      case 'Imprimantes':
        additionalOptions = [
          { value: 'impriment_type', label: 'Type d\'imprimante' }
        ];
        break;
      case 'Téléphones':
        additionalOptions = [
          { value: 'numero', label: 'Numéro' },
          { value: 'telephone_type', label: 'Type de téléphone' }
        ];
        break;
      case 'Serveurs':
        additionalOptions = [
          { value: 'processeur', label: 'Processeur' },
          { value: 'ram', label: 'RAM' },
          { value: 'stockage', label: 'Stockage' },
          { value: 'systeme_exploitation', label: 'Système d\'exploitation' },
          { value: 'role', label: 'Rôle' },
          { value: 'ip_adresse', label: 'Adresse IP' }
        ];
        break;

      case 'Logiciels':
        additionalOptions = [
          { value: 'version', label: 'Version' },
          { value: 'cle_licence', label: 'Clé de licence' },
          { value: 'date_expiration', label: 'Date d\'expiration' },
          { value: 'systeme_compatible', label: 'Système compatible' }
        ];
        break;

      case 'Stockages externes':
        additionalOptions = [
          { value: 'type_stockage', label: 'Type de stockage' },
          { value: 'capacite', label: 'Capacité' }
        ];
        break;

      case 'Routeurs':
        additionalOptions = [
          { value: 'ip_adresse', label: 'Adresse IP' },
          { value: 'nb_ports', label: 'Nombre de ports' },
          { value: 'vitesse', label: 'Vitesse' }
        ];
        break;

      case 'Périphériques':
        additionalOptions = [
          { value: 'type_peripherique', label: 'Type de périphérique' },
          { value: 'connectivite', label: 'Connectivité' },
          { value: 'compatible_os', label: 'Système compatible' }
        ];
        break;
      
    }
    
    return [...commonOptions, ...additionalOptions];
  };

  useEffect(() => {
    fetchData();
    // Reset editing and confirmation states when changing tabs
    setEditingItem(null);
    setConfirmDelete(null);
    setSearchTerm('');
    setSearchBy('name');
    setFilterBy('all');
    setAssignmentFilter('all');
  }, [type]);

  // Effect pour réappliquer les filtres quand les données changent
  useEffect(() => {
    applyFilters(searchTerm, searchBy, filterBy, assignmentFilter);
  }, [data]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'N/A' 
      : date.toLocaleDateString('fr-FR');
  };

  // Convertir l'état pour l'affichage
  const displayEtat = (etat) => {
    switch (etat) {
      case 'en_marche': return 'En marche';
      case 'en_panne': return 'En panne';
      default: return etat || 'Non spécifié';
    }
  };

  // Déterminer la classe CSS pour l'état
  const getEtatClass = (etat) => {
    switch (etat) {
      case 'en_marche': return 'bg-green-100 text-green-800';
      case 'en_panne': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Afficher les détails spécifiques selon le type
  const getTypeSpecificDetails = (item) => {
  switch (type) {
    case 'Ordinateurs':
      return (
        <>
          <span className="text-xs text-gray-500 block">Système d'exploitation : {item.system_exp || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">RAM : {item.ram || 'N/A'}, ROM : {item.rom || 'N/A'}</span>
        </>
      );

    case 'Écrans':
      return (
        <span className="text-xs text-gray-500 block">Taille : {item.taille || 'N/A'}</span>
      );

    case 'Imprimantes':
      return (
        <span className="text-xs text-gray-500 block">Type : {item.impriment_type || 'N/A'}</span>
      );

    case 'Téléphones':
      return (
        <>
          <span className="text-xs text-gray-500 block">N° : {item.numero || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">
            Type : {item.telephone_type === 'portable' ? 'Portable' : item.telephone_type === 'bureau' ? 'Bureau' : 'N/A'}
          </span>
        </>
      );

    case 'Serveurs':
      return (
        <>
          <span className="text-xs text-gray-500 block">Processeur : {item.processeur || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">RAM : {item.ram || 'N/A'}, Stockage : {item.stockage || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Système d'exploitation : {item.systeme_exploitation || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Rôle : {item.role || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Adresse IP : {item.ip_adresse || 'N/A'}</span>
        </>
      );

    case 'Logiciels':
      return (
        <>
          <span className="text-xs text-gray-500 block">Version : {item.version || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Clé de licence : {item.cle_licence || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Expiration : {item.date_expiration || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Système compatible : {item.systeme_compatible || 'N/A'}</span>
        </>
      );

    case 'Stockages externes':
      return (
        <>
          <span className="text-xs text-gray-500 block">Type : {item.type_stockage || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Capacité : {item.capacite || 'N/A'}</span>
        </>
      );

    case 'Routeurs':
      return (
        <>
          <span className="text-xs text-gray-500 block">Adresse IP : {item.ip_adresse || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Nombre de ports : {item.nb_ports || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Vitesse : {item.vitesse || 'N/A'}</span>
        </>
      );

    case 'Périphériques':
      return (
        <>
          <span className="text-xs text-gray-500 block">Type : {item.type_peripherique || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">Connectivité : {item.connectivite || 'N/A'}</span>
          <span className="text-xs text-gray-500 block">OS Compatible : {item.compatible_os || 'N/A'}</span>
        </>
      );

    default:
      return null;
  }
};

  const handleDownload=async () => {
    switch (type) {
      case 'Ordinateurs':
        window.open('http://localhost:8000/api/export-ordinateurs/', '_blank');
        break;
      case 'Écrans':
        window.open('http://localhost:8000/api/export-ecrants/', '_blank');
        break;
      case 'Imprimantes':
        window.open('http://localhost:8000/api/export-imprimantes/', '_blank');
        break;
      case 'Téléphones':
        window.open('http://localhost:8000/api/export-telephones/', '_blank');
        break;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        
       
                <div className="flex justify-between items-center mb-4">
                {/* Le nom du matériel reste à gauche */}
                <h2 className="text-xl font-semibold">{type}</h2>

                {/* Les deux boutons sont regroupés et alignés à droite */}
                <div className="flex items-center space-x-2"> {/* Utilisation de space-x-2 pour espacer les boutons */}
                    {/* Bouton d'impression */}
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-10 "
                    >
                        <Printer className="inline mr-2" /> {/* L'icône de l'imprimante */}
                    </button>

                    {/* Bouton d'ajout */}
                    <button
                        onClick={handleAdd}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 md:w-auto w-full" 
                    >
                        Ajouter {type.slice(0, -1)}
                    </button>
                </div>
                </div>
        
        
        {/* Barre de recherche et filtres améliorés */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Champ de recherche */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={`Rechercher par ${getSearchOptions().find(opt => opt.value === searchBy)?.label || 'nom'}`}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              />
            </div>
            
            {/* Sélecteur de champ de recherche */}
            <div className="md:w-1/5">
              <select
                value={searchBy}
                onChange={handleSearchByChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {getSearchOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Filtre par état */}
            <div className="md:w-1/5">
              <select
                value={filterBy}
                onChange={handleFilterByChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="all">Tous les états</option>
                <option value="en_marche">En marche</option>
                <option value="en_panne">En panne</option>
              </select>
            </div>
            
            {/* Filtre par assignation - NOUVEAU */}
            <div className="md:w-1/5">
              <select
                value={assignmentFilter}
                onChange={handleAssignmentFilterChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="all">Toutes les assignations</option>
                <option value="assigned">Assignés</option>
                <option value="stock">En stock</option>
              </select>
            </div>
            
            {/* Bouton de réinitialisation */}
            <div>
              <button
                onClick={handleResetFilters}
                className="w-full md:w-auto px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            </div>
          </div>
          
          {/* Information sur le nombre de résultats */}
          <div className="mt-2 text-sm text-gray-500">
            {filteredData.length} {filteredData.length === 1 ? type.slice(0, -1).toLowerCase() : type.toLowerCase()} trouvé{filteredData.length > 1 ? 's' : ''}
            {(searchTerm || filterBy !== 'all' || assignmentFilter !== 'all') && (
              <span> avec les filtres appliqués</span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterBy !== 'all' || assignmentFilter !== 'all' ? 
                `Aucun ${type.toLowerCase()} ne correspond à vos critères de recherche.` : 
                `Aucun ${type.toLowerCase()} n'a été trouvé.`}
            </p>
            {(searchTerm || filterBy !== 'all' || assignmentFilter !== 'all') && (
              <div className="mt-3">
                <button
                  onClick={handleResetFilters}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Achat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département/Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{item.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.marque || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEtatClass(item.etat)}`}>
                        {displayEtat(item.etat)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.date_achat)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-pretty">
                      {item.assigned_to && item.assigned_to_details ? (
                        `${item.assigned_to_details.first_name || ''} ${item.assigned_to_details.last_name || ''}`.trim() || 
                        `ID: ${item.assigned_to}`
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          En stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.assigned_to ? (
                        <div className="text-sm text-gray-900">
                          <div>
                            <span className="font-semibold text-blue-600">Service:</span>{' '}
                            {item.assigned_to_details.service_details.name}
                          </div>
                          <div>
                            <span className="font-semibold text-green-600">Département:</span>{' '}
                            {item.assigned_to_details.service_details.department_details.name}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">Aucun service assigné</div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeSpecificDetails(item)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 bg-white hover:bg-blue-300"
                      >
                        <Edit2 size={16} className="text-gray-500" />
                      </button>
                      {confirmDelete === item.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 font-bold"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="text-red-600 hover:text-red-900 bg-white hover:bg-red-300"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <MaterielForm
          open={isFormOpen}
          onClose={handleFormClose}
          materiel={editingItem}
          onSave={handleFormSave}
          type={type}
        />
      )}
    </div>
  );
};

export default MaterielTable;