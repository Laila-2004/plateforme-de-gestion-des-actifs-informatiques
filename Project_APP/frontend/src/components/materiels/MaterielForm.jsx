import React, { useEffect, useState } from 'react';
import {
  createComputer,updateComputer,createPrinter,updatePrinter,createEcrant,updateEcrant,
  createPhone,updatePhone,createServeur,updateServeur,createLogiciel,updateLogiciel,
  createStockageExterne,updateStockageExterne,createRouteur,updateRouteur,createPeripherique,
  updatePeripherique
} from '../../services/api/materielService';
import { getAllUsers } from '../../services/api/userService';

const MaterielForm = ({ open, onClose, materiel, onSave, type }) => {
  const initialFormState = {
  type: '',  // type de matériel (Ordinateur, Ecrant, etc.)
  name: '',
  marque: '',
  etat: 'en_marche',
  date_achat: new Date().toISOString().split('T')[0],
  assigned_to: null,

  // Champs spécifiques Ordinateur
  system_exp: '',
  rom: '',
  ram: '',

  // Champs spécifiques Ecrant
  taille: '',

  // Champs spécifiques Impriment
  impriment_type: '',

  // Champs spécifiques Telephone
  numero: '',
  telephone_type: 'portable',

  // Champs spécifiques Serveur
  processeur: '',
  stockage: '',
  systeme_exploitation: '',
  role: '',
  ip_adresse: '',

  // Champs spécifiques Logiciel
  version: '',
  cle_licence: '',
  date_expiration: '',  // Format YYYY-MM-DD
  systeme_compatible: '',

  // Champs spécifiques StockageExterne
  type_stockage: '',  // USB, SSD, HDD
  capacite: '',

  // Champs spécifiques Routeur
  routeur_ip_adresse: '',
  nb_ports: '',
  vitesse: '',

  // Champs spécifiques Peripherique
  type_peripherique: '',
  connectivite: '',
  compatible_os: '',
};


  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [typeM, setTypeM] = useState('');

  // Fonction pour déterminer le type de matériel
  const TypeMateriel = (t) => {
  let typeMapped = '';
  switch (t) {
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
    case 'Serveurs':
      typeMapped = 'Serveur';
      break;
    case 'Logiciels':
      typeMapped = 'Logiciel';
      break;
    case 'Stockages externes':
      typeMapped = 'StockageExterne';
      break;
    case 'Routeurs':
      typeMapped = 'Routeur';
      break;
    case 'Périphériques':
      typeMapped = 'Peripherique';
      break;
    default:
      alert('Type de matériel invalide');
      return;
  }

  setTypeM(typeMapped);

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
    // Format de la date d'achat
    const formattedDate = materiel.date_achat
      ? new Date(materiel.date_achat).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setFormData({
      ...materiel,
      date_achat: formattedDate,
      name: materiel.name || '',
      marque: materiel.marque || '',
      etat: materiel.etat || 'en_marche',
      assigned_to: materiel.assigned_to || null,

      // Champs spécifiques
      system_exp: materiel.system_exp || '',      // Ordinateur
      rom: materiel.rom || '',                    // Ordinateur
      ram: materiel.ram || '',                    // Ordinateur / Serveur

      taille: materiel.taille || '',              // Écran

      impriment_type: materiel.impriment_type || materiel.type || '',  // Imprimante

      numero: materiel.numero || '',              // Téléphone
      telephone_type: materiel.telephone_type || materiel.type || 'portable', // Téléphone

      processeur: materiel.processeur || '',      // Serveur
      stockage: materiel.stockage || '',          // Serveur
      systeme_exploitation: materiel.systeme_exploitation || '', // Serveur
      role: materiel.role || '',                  // Serveur
      ip_adresse: materiel.ip_adresse || '',      // Serveur / Routeur

      nom: materiel.nom || '',                    // Logiciel
      version: materiel.version || '',            // Logiciel
      cle_licence: materiel.cle_licence || '',    // Logiciel
      date_expiration: materiel.date_expiration 
        ? new Date(materiel.date_expiration).toISOString().split('T')[0]
        : '',

      systeme_compatible: materiel.systeme_compatible || '', // Logiciel

      type_stockage: materiel.type_stockage || '', // StockageExterne
      capacite: materiel.capacite || '',           // StockageExterne

      nb_ports: materiel.nb_ports || '',           // Routeur
      vitesse: materiel.vitesse || '',             // Routeur

      type_peripherique: materiel.type_peripherique || '', // Périphérique
      connectivite: materiel.connectivite || '',           // Périphérique
      compatible_os: materiel.compatible_os || '',         // Périphérique
    });
  } else {
    // Formulaire vide pour nouveau matériel
    setFormData({
      ...initialFormState,
      type: typeM,
    });
  }

  // Réinitialisation des erreurs
  setErrors({});
}, [materiel, open, typeM]);


  const validateForm = () => {
  const newErrors = {};

  if (!formData.name) newErrors.name = 'Le nom est requis';
  if (!formData.marque) newErrors.marque = 'La marque est requise';

  // Validation spécifique par type
  switch (typeM) {
    case 'Ordinateur':
      if (!formData.system_exp) newErrors.system_exp = 'Le système est requis';
      if (!formData.rom) newErrors.rom = 'La ROM est requise';
      if (!formData.ram) newErrors.ram = 'La RAM est requise';
      break;

    case 'Ecrant':
      if (!formData.taille) newErrors.taille = 'La taille est requise';
      break;

    case 'Impriment':
      if (!formData.impriment_type) newErrors.impriment_type = 'Le type est requis';
      break;

    case 'Telephone':
      if (!formData.numero) newErrors.numero = 'Le numéro est requis';
      break;

    case 'Serveur':
      if (!formData.processeur) newErrors.processeur = 'Le processeur est requis';
      if (!formData.ram) newErrors.ram = 'La RAM est requise';
      if (!formData.stockage) newErrors.stockage = 'Le stockage est requis';
      if (!formData.systeme_exploitation) newErrors.systeme_exploitation = 'Le système d’exploitation est requis';
      if (!formData.role) newErrors.role = 'Le rôle est requis';
      if (!formData.ip_adresse) newErrors.ip_adresse = 'L’adresse IP est requise';
      break;

    case 'Logiciel':
      if (!formData.nom) newErrors.nom = 'Le nom du logiciel est requis';
      if (!formData.version) newErrors.version = 'La version est requise';
      if (!formData.cle_licence) newErrors.cle_licence = 'La clé de licence est requise';
      if (!formData.systeme_compatible) newErrors.systeme_compatible = 'Le système compatible est requis';
      if (!formData.date_expiration) newErrors.date_expiration = 'La date d’expiration est requise';
      break;

    case 'StockageExterne':
      if (!formData.type_stockage) newErrors.type_stockage = 'Le type de stockage est requis';
      if (!formData.capacite) newErrors.capacite = 'La capacité est requise';
      break;

    case 'Routeur':
      if (!formData.nb_ports) newErrors.nb_ports = 'Le nombre de ports est requis';
      if (!formData.vitesse) newErrors.vitesse = 'La vitesse est requise';
      if (!formData.ip_adresse) newErrors.ip_adresse = 'L’adresse IP est requise';
      break;

    case 'Peripherique':
      if (!formData.type_peripherique) newErrors.type_peripherique = 'Le type de périphérique est requis';
      if (!formData.connectivite) newErrors.connectivite = 'La connectivité est requise';
      if (!formData.compatible_os) newErrors.compatible_os = 'Le système compatible est requis';
      break;

    default:
      newErrors.type = 'Type de matériel non reconnu';
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
      case 'Serveur':
        savedMateriel = materiel && materiel.id
          ? await updateServeur(materiel.id, dataToSubmit)
          : await createServeur(dataToSubmit);
        break;
      case 'Logiciel':
        savedMateriel = materiel && materiel.id
          ? await updateLogiciel(materiel.id, dataToSubmit)
          : await createLogiciel(dataToSubmit);
        break;
      case 'StockageExterne':
        savedMateriel = materiel && materiel.id
          ? await updateStockageExterne(materiel.id, dataToSubmit)
          : await createStockageExterne(dataToSubmit);
        break;
      case 'Routeur':
        savedMateriel = materiel && materiel.id
          ? await updateRouteur(materiel.id, dataToSubmit)
          : await createRouteur(dataToSubmit);
        break;
      case 'Peripherique':
        savedMateriel = materiel && materiel.id
          ? await updatePeripherique(materiel.id, dataToSubmit)
          : await createPeripherique(dataToSubmit);
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
            className="text-gray-500 hover:text-gray-700 bg-red-300 hover:bg-red-500 w-10"
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

          {/* Champs spécifiques pour Serveur */}
          {typeM === 'Serveur' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Processeur *</label>
                <input
                  type="text"
                  name="processeur"
                  value={formData.processeur}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.processeur ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}

                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>RAM *</label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.ram ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Stockage *</label>
                <input
                  type="text"
                  name="stockage"
                  value={formData.stockage}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.stockage ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Système d'exploitation *</label>
                <input
                  type="text"
                  name="systeme_exploitation"
                  value={formData.systeme_exploitation}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.system_exp ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Rôle *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Adresse IP</label>
                <input
                  type="text"
                  name="ip_adresse"
                  value={formData.ip_adresse}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.ip_adresse ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  placeholder="192.168.1.1"
                  title="Veuillez entrer une adresse IP valide (ex: 192.168.1.1)"
                  onInput={(e) => {
                    // Permet seulement les chiffres et les points
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    
                    // Empêche plus de 3 points
                    const dots = (e.target.value.match(/\./g) || []).length;
                    if (dots > 3) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                    
                    // Empêche les points consécutifs
                    e.target.value = e.target.value.replace(/\.{2,}/g, '.');
                    
                    // Empêche de commencer par un point
                    if (e.target.value.startsWith('.')) {
                      e.target.value = e.target.value.substring(1);
                    }
                    
                    // Limite chaque octet à 255
                    const parts = e.target.value.split('.');
                    for (let i = 0; i < parts.length; i++) {
                      if (parseInt(parts[i]) > 255) {
                        parts[i] = '255';
                      }
                    }
                    e.target.value = parts.join('.');
                  }}
                />
                {errors.ip_adresse && (
                  <p className="mt-1 text-sm text-red-600">{errors.ip_adresse}</p>
                )}
              </div>
            </>
          )}


          {/* Champs spécifiques pour Logiciel */}
          {typeM === 'Logiciel' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Version *</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.version ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Clé de licence *</label>
                <input
                  type="text"
                  name="cle_licence"
                  value={formData.cle_licence}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.cle_licence ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Date d'expiration</label>
                <input
                  type="date"
                  name="date_expiration"
                  value={formData.date_expiration}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.date_expiration ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Système compatible</label>
                <input
                  type="text"
                  name="systeme_compatible"
                  value={formData.systeme_compatible}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.systeme_compatible ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                />
              </div>
            </>
          )}

          {/* Champs spécifiques pour StockageExterne */}
          {typeM === 'StockageExterne' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Type de stockage *</label>
                <input
                  type="text"
                  name="type_stockage"
                  value={formData.type_stockage}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.type_stockage ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Capacité *</label>
                <input
                  type="text"
                  name="capacite"
                  value={formData.capacite}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.capacite ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
            </>
          )}


          {/* Champs spécifiques pour Routeur */}
          {typeM === 'Routeur' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Adresse IP</label>
                <input
                  type="text"
                  name="ip_adresse"
                  value={formData.ip_adresse}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.ip_adresse ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  placeholder="192.168.1.1"
                  title="Veuillez entrer une adresse IP valide (ex: 192.168.1.1)"
                  onInput={(e) => {
                    // Permet seulement les chiffres et les points
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    
                    // Empêche plus de 3 points
                    const dots = (e.target.value.match(/\./g) || []).length;
                    if (dots > 3) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                    
                    // Empêche les points consécutifs
                    e.target.value = e.target.value.replace(/\.{2,}/g, '.');
                    
                    // Empêche de commencer par un point
                    if (e.target.value.startsWith('.')) {
                      e.target.value = e.target.value.substring(1);
                    }
                    
                    // Limite chaque octet à 255
                    const parts = e.target.value.split('.');
                    for (let i = 0; i < parts.length; i++) {
                      if (parseInt(parts[i]) > 255) {
                        parts[i] = '255';
                      }
                    }
                    e.target.value = parts.join('.');
                  }}
                />
                {errors.ip_adresse && (
                  <p className="mt-1 text-sm text-red-600">{errors.ip_adresse}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Nombre de ports *</label>
                <input
                  type="number"
                  name="nb_ports"
                  value={formData.nb_ports}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.nb_ports ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Vitesse *</label>
                <input
                  type="text"
                  name="vitesse"
                  value={formData.vitesse}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.vitesse ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                />
              </div>
            </>
          )}

          {/* Champs spécifiques pour Périphérique */}
          {typeM === 'Peripherique' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Type de périphérique *</label>
                <select
                  name="type_peripherique"
                  value={formData.type_peripherique}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.type_peripherique ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="clavier">Clavier</option>
                  <option value="souris">Souris</option>
                  <option value="casque">Casque</option>
                  <option value="webcam">Webcam</option>
                  <option value="microphone">Microphone</option>
                  <option value="haut_parleur">Haut-parleur</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Connectivité</label>
                <input
                  type="text"
                  name="connectivite"
                  value={formData.connectivite}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.connectivite ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Système compatible</label>
                <input
                  type="text"
                  name="compatible_os"
                  value={formData.compatible_os}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.compatible_os ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
                />
              </div>
            </>
          )}


          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
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