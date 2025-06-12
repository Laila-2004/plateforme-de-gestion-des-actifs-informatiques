import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserFormModal = ({ isOpen, onClose, onSubmit, onDelete, user, departments, services, computers, printers, ecrants, phones,logiciels,peripheriques,routeurs,serveurs,stockagesExterne, }) => {
  const initialFormState = {
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
    department: '',
    service: '',
    assignedMaterials: [],
    is_active:true
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState({});
  const [availableComputers, setAvailableComputers] = useState([]);
  const [availablePhones, setAvailablePhones] = useState([]);
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [availableEcrants, setAvailableEcrants] = useState([]);
  const [availableLogiciels, setAvailableLogiciels] = useState([]);
  const [availablePeripheriques, setAvailablePeripheriques] = useState([]);
  const [availableRouteurs, setAvailableRouteurs] = useState([]);
  const [availableServeurs, setAvailableServeurs] = useState([]);
  const [availableStockagesExterne, setAvailableStockagesExterne] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ type: '', id: '' }); // Pour l'ajout de matériel

  // Helper function pour obtenir les détails du matériel
  const getMaterialDetails = (materialId, type) => {
    if (!materialId || !type) return null;
    
    let material = null;
    switch (type) {
      case 'computer':
        material = computers.find(c => c.id === materialId || c.id === parseInt(materialId));
        break;
      case 'phone':
        material = phones.find(p => p.id === materialId || p.id === parseInt(materialId));
        break;
      case 'printer':
        material = printers.find(pr => pr.id === materialId || pr.id === parseInt(materialId));
        break;
      case 'ecrant':
        material = ecrants.find(e => e.id === materialId || e.id === parseInt(materialId));
      case 'logiciel':
        material = logiciels.find(l => l.id === materialId || l.id === parseInt(materialId));
        break; 
      case 'peripherique':
        material = peripheriques.find(p => p.id === materialId || p.id === parseInt(materialId)); 
        break;
      case 'routeur':
        material = routeurs.find(r => r.id === materialId || r.id === parseInt(materialId));
        break;
      case 'serveur':
        material = serveurs.find(s => s.id === materialId || s.id === parseInt(materialId));
        break;
      case 'stockageExterne':
        material = stockagesExterne.find(s => s.id === materialId || s.id === parseInt(materialId));
        break;
      default:
        return null;
    }
    
    return material || null;
  };

  useEffect(() => {
    const loadAvailableMaterials = async () => {
      try {
        // Filtrer les matériels disponibles ou déjà assignés à cet utilisateur
        const allAvailableComputers = computers.filter(c => !c.assigned_to || (user && c.assigned_to === user.id));
        const allAvailablePhones = phones.filter(p => !p.assigned_to || (user && p.assigned_to === user.id));
        const allAvailablePrinters = printers.filter(pr => !pr.assigned_to || (user && pr.assigned_to === user.id));
        const allAvailableEcrants = ecrants.filter(e => !e.assigned_to || (user && e.assigned_to === user.id));
        const allAvailableLogiciels = logiciels.filter(l => !l.assigned_to || (user && l.assigned_to === user.id));
        const allAvailablePeripheriques = peripheriques.filter(p => !p.assigned_to || (user && p.assigned_to === user.id));
        const allAvailableRouteurs = routeurs.filter(r => !r.assigned_to || (user && r.assigned_to === user.id));
        const allAvailableServeurs = serveurs.filter(s => !s.assigned_to || (user && s.assigned_to === user.id));
        const allAvailableStockagesExterne = stockagesExterne.filter(s => !s.assigned_to || (user && s.assigned_to === user.id));

        setAvailableComputers(allAvailableComputers);
        setAvailablePhones(allAvailablePhones);
        setAvailablePrinters(allAvailablePrinters);
        setAvailableEcrants(allAvailableEcrants);
        setAvailableLogiciels(allAvailableLogiciels);
        setAvailablePeripheriques(allAvailablePeripheriques);
        setAvailableRouteurs(allAvailableRouteurs);
        setAvailableServeurs(allAvailableServeurs);
        setAvailableStockagesExterne(allAvailableStockagesExterne);
      } catch (error) {
        console.error("Erreur lors du chargement des matériels disponibles:", error);
      }
    };

    if (isOpen) {
      if (user) {
        const assignedMaterials = [];
        
        // Récupérer tous les matériels assignés à l'utilisateur
        computers.filter(c => c.assigned_to === user.id).forEach(c => 
          assignedMaterials.push({ id: c.id.toString(), type: 'computer' }));
        phones.filter(p => p.assigned_to === user.id).forEach(p => 
          assignedMaterials.push({ id: p.id.toString(), type: 'phone' }));
        printers.filter(pr => pr.assigned_to === user.id).forEach(pr => 
          assignedMaterials.push({ id: pr.id.toString(), type: 'printer' }));
        ecrants.filter(e => e.assigned_to === user.id).forEach(e => 
          assignedMaterials.push({ id: e.id.toString(), type: 'ecrant' }));
        logiciels.filter(l => l.assigned_to === user.id).forEach(l =>
          assignedMaterials.push({ id: l.id.toString(), type: 'logiciel' }));
        peripheriques.filter(p => p.assigned_to === user.id).forEach(p =>
          assignedMaterials.push({ id: p.id.toString(), type: 'peripherique' }));
        routeurs.filter(r => r.assigned_to === user.id).forEach(r =>
          assignedMaterials.push({ id: r.id.toString(), type: 'routeur' }));
        serveurs.filter(s => s.assigned_to === user.id).forEach(s =>
          assignedMaterials.push({ id: s.id.toString(), type: 'serveur' }));
        stockagesExterne.filter(s => s.assigned_to === user.id).forEach(s =>
          assignedMaterials.push({ id: s.id.toString(), type: 'stockageExterne' }));

        
        setForm({
          username: user.username || '',
          password: '',
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          role: user.role || '',
          service: user.service_details?.id || '',
          department: user.service_details?.department_details?.id || '',
          assignedMaterials: assignedMaterials,
          is_active: user.is_active
        });
      } else {
        setForm(initialFormState);
      }
      loadAvailableMaterials();
      setErrors({});
      setFormTouched({});
    }
  }, [user, isOpen, computers, phones, printers, ecrants, logiciels, peripheriques, routeurs, serveurs, stockagesExterne]);

 const handleChange = (e) => {
  const { name, type, value, checked } = e.target;

  const newValue = type === 'checkbox' ? checked : value;

  setForm({ ...form, [name]: newValue });
  setFormTouched({ ...formTouched, [name]: true });

  if (errors[name]) {
    setErrors({ ...errors, [name]: null });
  }
};


  const handleAddMaterial = () => {
    if (newMaterial.type && newMaterial.id) {
      const materialExists = form.assignedMaterials.find(m => 
        m.id === newMaterial.id && m.type === newMaterial.type);
      
      if (!materialExists) {
        setForm(prevForm => ({
          ...prevForm,
          assignedMaterials: [...prevForm.assignedMaterials, { 
            id: newMaterial.id, 
            type: newMaterial.type 
          }],
        }));
        setNewMaterial({ type: '', id: '' }); // reset
      }
    }
  };

  const handleRemoveMaterial = (materialId, materialType) => {
    setForm(prevForm => ({
      ...prevForm,
      assignedMaterials: prevForm.assignedMaterials.filter(
        m => !(m.id === materialId && m.type === materialType)
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const required = ['username', 'email', 'first_name', 'last_name', 'role', 'department'];
    if (!user) required.push('password');

    required.forEach(field => {
      if (!form[field]) {
        const fieldNames = {
          username: "Nom d'utilisateur",
          password: "Mot de passe",
          email: "Email",
          first_name: "Prénom",
          last_name: "Nom",
          role: "Rôle",
          department: "Département",
          service: 'Service'
        };
        newErrors[field] = `${fieldNames[field] || field} est requis`;
      }
    });

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (form.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(form.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setFormTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Préparer les données pour l'envoi
      const userData = {
        ...form,
        // S'assurer que les IDs sont correctement formatés
        department: form.department ? parseInt(form.department, 10) : null,
        service: form.service ? parseInt(form.service, 10) : null,
        // Inclure les informations d'assignation de matériel
        materials_to_assign: form.assignedMaterials.map(material => ({
          id: parseInt(material.id, 10),
          type: material.type
        }))
      };
      
      await onSubmit(userData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getFieldErrorClass = (fieldName) => {
    return formTouched[fieldName] && errors[fieldName]
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const renderErrorMessage = (fieldName) => {
    if (formTouched[fieldName] && errors[fieldName]) {
      return <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>;
    }
    return null;
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm";
  const selectClass = `${inputClass} appearance-none bg-white pr-10`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {user ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none bg-white hover:bg-slate-300 w-10"
            aria-label="Fermer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className={labelClass}>
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={form.username}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('username')}`}
                />
                {renderErrorMessage('username')}
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  {user ? 'Nouveau mot de passe' : 'Mot de passe'}
                </label>
                <input
                  id="password"
                  name="password"
                  placeholder={user ? "Laisser vide pour ne pas modifier" : "Mot de passe"}
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('password')}`}
                />
                {renderErrorMessage('password')}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="exemple@email.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('email')}`}
                />
                {renderErrorMessage('email')}
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  placeholder="+212 XX XX XX XX"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('phone')}`}
                />
                {renderErrorMessage('phone')}
              </div>
              <div>
                <label htmlFor="is_active" className={labelClass}>
                  Utilisateur actif
                </label>
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 mt-2 accent-blue-600"
                />
              </div>

            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="first_name" className={labelClass}>
                  Prénom
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  placeholder="Prénom"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('first_name')}`}
                />
                {renderErrorMessage('first_name')}
              </div>

              <div>
                <label htmlFor="last_name" className={labelClass}>
                  Nom
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  placeholder="Nom"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`${inputClass} ${getFieldErrorClass('last_name')}`}
                />
                {renderErrorMessage('last_name')}
              </div>

              <div>
                <label htmlFor="role" className={labelClass}>
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`${selectClass} ${getFieldErrorClass('role')}`}
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="technicien">Technicien</option>
                  <option value="utilisateurNormal">Utilisateur Normal</option>
                </select>
                {renderErrorMessage('role')}
              </div>

              <div>
                <label htmlFor="department" className={labelClass}>
                  Département
                </label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={`${selectClass} ${getFieldErrorClass('department')}`}
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map(dep => (
                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                  ))}
                </select>
                {renderErrorMessage('department')}
              </div>
              <div>
                <label htmlFor="service" className={labelClass}>
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={`${selectClass} ${getFieldErrorClass('service')}`}
                >
                  <option value="">Sélectionner un service</option>
                  {services
                    .filter(s => s.department === parseInt(form.department))
                    .map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                </select>
                {renderErrorMessage('service')}
              </div>


            </div>
            {/* Material Assignment Section */}
            <div className="col-span-2 border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Matériels Assignés</h3>

              {/* Display Assigned Materials */}
              {form.assignedMaterials.length > 0 && (
                <div className="mb-4 space-y-2">
                  {form.assignedMaterials.map((material) => {
                    const materialDetails = getMaterialDetails(material.id, material.type);
                    const materialName = materialDetails ? materialDetails.name : 'Non trouvé';
                    const materialMarque = materialDetails ? materialDetails.marque || materialDetails.modele : 'Non spécifié';
                    
                    return (
                      <div key={`${material.type}-${material.id}`} className="flex items-center justify-between p-2 rounded-md bg-gray-100">
                        <div>
                          <span className="font-semibold capitalize">{material.type}:</span> {materialName} - {materialMarque}
                        </div>
                        <button
                          onClick={() => handleRemoveMaterial(material.id, material.type)}
                          className="text-blue-500 bg-white hover:text-red-700 hover:bg-red-400 transition-colors duration-200 w-10"
                          aria-label="Supprimer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Material */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="material_type" className={labelClass}>Type</label>
                  <select
                    id="material_type"
                    name="material_type"
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value, id: '' })}
                    className={selectClass}
                  >
                    <option value="">Type</option>
                    <option value="computer">Ordinateur</option>
                    <option value="phone">Téléphone</option>
                    <option value="printer">Imprimante</option>
                    <option value="ecrant">Écran</option>
                    <option value="logiciel">Logiciel</option>
                    <option value="peripherique">Périphérique</option>
                    <option value="routeur">Routeur</option>
                    <option value="serveur">Serveur</option>
                    <option value="stockageExterne">Stockage Externe</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="material_id" className={labelClass}>Matériel</label>
                  <select
                    id="material_id"
                    name="material_id"
                    value={newMaterial.id}
                    onChange={(e) => setNewMaterial({ ...newMaterial, id: e.target.value })}
                    className={selectClass}
                    disabled={!newMaterial.type} // Disable if no type is selected
                  >
                    <option value="">Sélectionnez un matériel</option>
                    {newMaterial.type === 'computer' &&
                      availableComputers.map(computer => (
                        <option key={computer.id} value={computer.id}>
                          {computer.name} - {computer.marque || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'phone' &&
                      availablePhones.map(phone => (
                        <option key={phone.id} value={phone.id}>
                          {phone.name} - {phone.modele || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'printer' &&
                      availablePrinters.map(printer => (
                        <option key={printer.id} value={printer.id}>
                          {printer.name} - {printer.marque || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'ecrant' &&
                      availableEcrants.map(ecrant => (
                        <option key={ecrant.id} value={ecrant.id}>
                          {ecrant.name} - {ecrant.marque || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'logiciel' &&
                      availableLogiciels.map(logiciel => (
                        <option key={logiciel.id} value={logiciel.id}>
                          {logiciel.name} - {logiciel.version || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'peripherique' &&
                      availablePeripheriques.map(peripherique => (
                        <option key={peripherique.id} value={peripherique.id}>
                          {peripherique.name} - {peripherique.marque || 'Non spécifié'} -{peripherique.type_peripherique || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'routeur' &&
                      availableRouteurs.map(routeur => (
                        <option key={routeur.id} value={routeur.id}>
                          {routeur.name} - {routeur.marque || 'Non spécifié'}   
                        </option>
                      ))}
                    {newMaterial.type === 'serveur' &&
                      availableServeurs.map(serveur => (
                        <option key={serveur.id} value={serveur.id}>
                          {serveur.name} - {serveur.marque || 'Non spécifié'}
                        </option>
                      ))}
                    {newMaterial.type === 'stockageExterne' &&
                      availableStockagesExterne.map(stockage => (
                        <option key={stockage.id} value={stockage.id}>
                          {stockage.name} - {stockage.marque || 'Non spécifié'}
                        </option>
                      ))}

                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddMaterial}
                    disabled={!newMaterial.type || !newMaterial.id}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between">
          {user && (
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="mb-3 sm:mb-0 flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suppression...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </>
              )}
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {user ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                user ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UserFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.object,
  departments: PropTypes.array,
  services: PropTypes.array,
  computers: PropTypes.array,
  printers: PropTypes.array,
  ecrants: PropTypes.array,
  phones: PropTypes.array,
};

UserFormModal.defaultProps = {
  user: null,
  departments: [],
  services: [],
  computers: [],
  printers: [],
  ecrants: [],
  phones: [],
};

export default UserFormModal;