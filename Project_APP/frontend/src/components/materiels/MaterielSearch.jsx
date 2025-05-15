import React, { useState } from 'react';
import {
  searchComputers,
  searchEcrants,
  searchPrinters,
  searchPhones
} from '../../services/api/materielService';

const MaterielSearch = ({ type, setData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search is empty, fetch all data
      switch (type) {
        case 'Ordinateurs': 
          const computers = await searchComputers('', '');
          setData(computers);
          break;
        case 'Écrans': 
          const ecrans = await searchEcrants('', '');
          setData(ecrans);
          break;
        case 'Imprimantes': 
          const printers = await searchPrinters('', '');
          setData(printers);
          break;
        case 'Téléphones': 
          const phones = await searchPhones('', '');
          setData(phones);
          break;
      }
      return;
    }

    try {
      let searchResults;
      switch (type) {
        case 'Ordinateurs':
          searchResults = await searchComputers(searchField, searchTerm);
          break;
        case 'Écrans':
          searchResults = await searchEcrants(searchField, searchTerm);
          break;
        case 'Imprimantes':
          searchResults = await searchPrinters(searchField, searchTerm);
          break;
        case 'Téléphones':
          searchResults = await searchPhones(searchField, searchTerm);
          break;
      }
      setData(searchResults || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    setSearchField('name');
    // Reset search by fetching all data
    switch (type) {
      case 'Ordinateurs': 
        const computers = await searchComputers('', '');
        setData(computers);
        break;
      case 'Écrans': 
        const ecrans = await searchEcrants('', '');
        setData(ecrans);
        break;
      case 'Imprimantes': 
        const printers = await searchPrinters('', '');
        setData(printers);
        break;
      case 'Téléphones': 
        const phones = await searchPhones('', '');
        setData(phones);
        break;
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="border rounded-md p-2"
      >
        <option value="name">Nom</option>
        <option value="marque">Marque</option>
        <option value="modele">Modèle</option>
        <option value="numero_serie">Numéro de série</option>
        <option value="etat">État</option>
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher..."
        className="border rounded-md p-2 flex-grow"
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Rechercher
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
      >
        Réinitialiser
      </button>
    </div>
  );
};

export default MaterielSearch;