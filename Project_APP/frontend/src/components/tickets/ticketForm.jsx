export default function TicketForm({ 
    formData, 
    handleChange, 
    handleSubmit, 
    handleAssetTypeChange,
    assetType,
    assets,
    technicians,
    onClose,
    isEditing,
    ticketId,
    currentUser
  }) {
    // Fonction modifiée pour gérer le changement de statut
    const handleStatusChange = (e) => {
      const { name, value } = e.target;
   
      // Si le statut passe à "fermé", on ajoute la date de fermeture
      if (name === "status" && value === "fermé") {
        const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        handleChange({
          target: {
            name: "close_date",
            value: currentDate
          }
        });
      }
      
      // On appelle aussi le handleChange original pour mettre à jour le statut
      handleChange(e);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {isEditing ? `Modifier le ticket #${ticketId}` : 'Ajouter un nouveau ticket'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-600 hover:text-gray-900 w-10 h-10 rounded-full bg-white hover:bg-red-300 flex items-center justify-center"
            >
              X
            </button>
          </div>
 

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange} // Utilisation de notre nouvelle fonction
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="reseau">Problème Réseau</option>
                  <option value="materiel">Problème Matériel</option>
                  <option value="logiciel">Problème Logiciel</option>
                  <option value="securite">Problème de Sécurité</option>
                  <option value="compte">Problème de Compte</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de ticket</label>
                <select
                  name="type_ticket"
                  value={formData.type_ticket}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="incident">Incident</option>
                  <option value="demande">Demande</option>
                  <option value="maintenance">Maintenance Préventive</option>
                </select>
              </div>
             {currentUser.role =='admin' &&( <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Sélectionner un technicien --</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.first_name} {tech.last_name} ({tech.username})
                    </option>
                  ))}
                </select>
              </div>)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'équipement</label>
                <select
                  name="asset_type"
                  value={assetType}
                  onChange={handleAssetTypeChange}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="ordinateur">Ordinateur</option>
                  <option value="imprimante">Imprimante</option>
                  <option value="telephone">Téléphone</option>
                  <option value="ecran">Écran</option>
                  <option value="logiciel">Logiciel</option>
                  <option value="peripherique">Peripherique</option>
                  <option value="routeur">Routeur</option>
                  <option value="serveur">Serveur</option>
                  <option value="stockage_externe">Stockage Externe</option>

                </select>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipement concerné</label>
                <select
                  name="asset"
                  value={formData.asset || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Sélectionner un équipement --</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {assetType === 'ordinateur' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name}</div>
                        </div>
                      )}

                      {assetType === 'imprimante' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}

                      {assetType === 'telephone' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}

                      {assetType === 'ecran' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}

                      {assetType === 'logiciel' && (
                        <div>
                          <div>Nom: {asset.name} | </div>
                          <div>Version: {asset.version}</div>
                        </div>
                      )}

                      {assetType === 'peripherique' && (
                        <div>
                          <div>Nom: {asset.name} | </div>
                          <div>Type: {asset.type}</div>
                        </div>
                      )}

                      {assetType === 'routeur' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}

                      {assetType === 'serveur' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}

                      {assetType === 'stockage_externe' && (
                        <div>
                          <div>Marque: {asset.marque} | </div>
                          <div>Nom: {asset.name} | </div>
                          <div>ID: {asset.id}</div>
                        </div>
                      )}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Affichage conditionnel du champ de date de fermeture */}
              {formData.status === "fermé" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fermeture</label>
                  <input
                    type="date"
                    name="close_date"
                    value={formData.close_date || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                {isEditing ? 'Sauvegarder' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }