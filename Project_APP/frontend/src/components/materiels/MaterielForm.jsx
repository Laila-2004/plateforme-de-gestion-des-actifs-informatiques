import React, { useEffect, useState } from 'react';
import {
  createComputer,
  updateComputer,
  createPrinter,
  updatePrinter,
  createEcrant,
  updateEcrant,
  createPhone,
  updatePhone,
} from '../../services/api/materielService';
import { getAllUsers } from '../../services/api/userService';

const MaterielForm = ({ open, onClose, materiel, onSave, type }) => {
  const initialFormState = {
    type: '',  // Cette valeur sera mise à jour selon typeM
    name: '',
    marque: '',
    etat: 'en_marche',
    date_achat: new Date().toISOString().split('T')[0],
    assigned_to: null,
    notes: '',
    // Champs spécifiques pour Ordinateur
    system_exp: '',
    rom: '',
    ram: '',
    // Champ spécifique pour Ecrant
    taille: '',
    // Champ spécifique pour Impriment
    impriment_type: '',
    // Champs spécifiques pour Telephone
    numero: '',
    telephone_type: 'portable',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [typeM, setTypeM] = useState('');

  // Fonction pour déterminer le type de matériel
  const TypeMateriel = (t) => {
    let typeMapped = '';
    switch(t) {
      case 'Ordinateurs':
        typeMapped = 'Ordinateur';
        break;
      case 'Écrans':
        typeMapped = 'Ecrant';
        break;
      case 'Imprimantes':
        typeMapped = 'Impriment';
        break;
      case 'Téléphones':
        typeMapped = 'Telephone';
        break;
      default: 
        alert('Type de matériel invalide');
    }
    setTypeM(typeMapped);
    
    // Mise à jour immédiate du type dans formData
    setFormData(prevState => ({
      ...prevState,
      type: typeMapped
    }));
  };

  // Récupérer les utilisateurs et définir le type initial
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    };
    
    fetchUsers();
    TypeMateriel(type);
  }, [type]);

  // Réinitialiser le formulaire quand le matériel change
  useEffect(() => {
    if (materiel) {
      // Format the date correctly if it exists
      const formattedDate = materiel.date_achat
        ? new Date(materiel.date_achat).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        ...materiel,
        date_achat: formattedDate,
        // Ensure all required fields have at least empty string values
        name: materiel.name || '',
        marque: materiel.marque || '',
        etat: materiel.etat || 'en_marche',
        assigned_to: materiel.assigned_to || null,
        // Champs spécifiques pour chaque type
        system_exp: materiel.system_exp || '',
        rom: materiel.rom || '',
        ram: materiel.ram || '',
        taille: materiel.taille || '',
        impriment_type: materiel.impriment_type || '',
        numero: materiel.numero || '',
        telephone_type: materiel.telephone_type || 'portable',
      });
    } else {
      // Pour un nouveau matériel, assurez-vous que le type est défini
      setFormData({
        ...initialFormState,
        type: typeM  // Important: définir le type selon typeM
      });
    }
    // Clear any previous errors
    setErrors({});
  }, [materiel, open, typeM]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.marque) newErrors.marque = 'La marque est requise';
    
    // Validation spécifique par type
    if (typeM === 'Ordinateur') {
      if (!formData.system_exp) newErrors.system_exp = 'Le système est requis';
      if (!formData.rom) newErrors.rom = 'La ROM est requise';
      if (!formData.ram) newErrors.ram = 'La RAM est requise';
    } else if (typeM === 'Ecrant') {
      if (!formData.taille) newErrors.taille = 'La taille est requise';
    } else if (typeM === 'Impriment') {
      if (!formData.impriment_type) newErrors.impriment_type = 'Le type est requis';
    } else if (typeM === 'Telephone') {
      if (!formData.numero) newErrors.numero = 'Le numéro est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Assurez-vous que le type est défini avant de soumettre
    const dataToSubmit = {
      ...formData,
      type: typeM  // S'assurer que le type est correct
    };

    console.log("Données à soumettre:", dataToSubmit);  // Pour déboguer

    setIsSubmitting(true);
    try {
      let savedMateriel;
      switch (typeM) {
        case 'Ordinateur':
          savedMateriel = materiel && materiel.id
            ? await updateComputer(materiel.id, dataToSubmit)
            : await createComputer(dataToSubmit);
          break;
        case 'Impriment':
          savedMateriel = materiel && materiel.id
            ? await updatePrinter(materiel.id, dataToSubmit)
            : await createPrinter(dataToSubmit);
          break;
        case 'Ecrant':
          savedMateriel = materiel && materiel.id
            ? await updateEcrant(materiel.id, dataToSubmit)
            : await createEcrant(dataToSubmit);
          break;
        case 'Telephone':
          savedMateriel = materiel && materiel.id
            ? await updatePhone(materiel.id, dataToSubmit)
            : await createPhone(dataToSubmit);
          break;
        default:
          alert('Type de matériel invalide: ' + typeM);
          setIsSubmitting(false);
          return;
      }

      onSave(savedMateriel);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du matériel :', error);
      alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {materiel && materiel.id ? `Modifier ${typeM}` : `Ajouter un ${typeM}`}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marque *</label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.marque ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
              required
            />
            {errors.marque && <p className="mt-1 text-sm text-red-600">{errors.marque}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">État</label>
            <select
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            >
              <option value="en_marche">En marche</option>
              <option value="en_panne">En panne</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigné à</label>
            <select
              name="assigned_to"
              value={formData.assigned_to || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            >
              <option value="">Non assigné</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'achat</label>
            <input
              type="date"
              name="date_achat"
              value={formData.date_achat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* Champs spécifiques pour Ordinateur */}
          {typeM === 'Ordinateur' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Système d'exploitation *</label>
                <input
                  type="text"
                  name="system_exp"
                  value={formData.system_exp}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.system_exp ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
                {errors.system_exp && <p className="mt-1 text-sm text-red-600">{errors.system_exp}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ROM *</label>
                <input
                  type="text"
                  name="rom"
                  value={formData.rom}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.rom ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
                {errors.rom && <p className="mt-1 text-sm text-red-600">{errors.rom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">RAM *</label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.ram ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
                {errors.ram && <p className="mt-1 text-sm text-red-600">{errors.ram}</p>}
              </div>
            </>
          )}

          {/* Champ spécifique pour Ecrant */}
          {typeM === 'Ecrant' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Taille *</label>
              <input
                type="text"
                name="taille"
                value={formData.taille}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.taille ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                required
              />
              {errors.taille && <p className="mt-1 text-sm text-red-600">{errors.taille}</p>}
            </div>
          )}

          {/* Champ spécifique pour Impriment */}
          {typeM === 'Impriment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Type d'imprimante *</label>
              <input
                type="text"
                name="impriment_type"
                value={formData.impriment_type}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.impriment_type ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                required
              />
              {errors.impriment_type && <p className="mt-1 text-sm text-red-600">{errors.impriment_type}</p>}
            </div>
          )}

          {/* Champs spécifiques pour Telephone */}
          {typeM === 'Telephone' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro *</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.numero ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
                {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de téléphone</label>
                <select
                  name="telephone_type"
                  value={formData.telephone_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                >
                  <option value="portable">Portable</option>
                  <option value="bureau">Bureau</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : materiel && materiel.id ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterielForm;