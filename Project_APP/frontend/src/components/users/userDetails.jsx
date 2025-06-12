import { useEffect, useState } from "react";

const UserDetails = ({ isOpen, onClose, user, computers, phones, printers, ecrants,logiciels,peripheriques,routeurs,serveurs,stockagesExterne,onEdit }) => {
  const [userDetails, setUserDetails] = useState({});
  const [assignedMaterials, setAssignedMaterials] = useState([]);

  useEffect(() => {
    if (user && isOpen) {
      setUserDetails({
        username: user.username || '',
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        role: user.role || '',
        service: user.service_details?.name || '',
        department: user.service_details?.department_details?.name || '',
        isActive: user.is_active ?? true,
      });

      const filteredComputers = computers
        .filter(comp => comp.assigned_to === user.id)
        .map(comp => ({ ...comp, type: "Ordinateur" }));

      const filteredPhones = phones
        .filter(phone => phone.assigned_to === user.id)
        .map(phone => ({ ...phone, type: "Téléphone" }));

      const filteredPrinters = printers
        .filter(printer => printer.assigned_to === user.id)
        .map(printer => ({ ...printer, type: "Imprimante" }));

      const filteredScreens = ecrants
        .filter(ecrant => ecrant.assigned_to === user.id)
        .map(ecrant => ({ ...ecrant, type: "Écran" }));

      const filteredLogiciels = logiciels
        .filter(software => software.assigned_to === user.id)
        .map(software => ({ ...software, type: "Logiciel" }));

      const filteredPeripheriques = peripheriques
        .filter(peripherique => peripherique.assigned_to === user.id)
        .map(peripherique => ({ ...peripherique, type: "Périphérique" }));

      const filteredRouteurs = routeurs
        .filter(routeur => routeur.assigned_to === user.id)
        .map(routeur => ({ ...routeur, type: "Routeur" })); 

      const filteredServeurs = serveurs
        .filter(serveur => serveur.assigned_to === user.id)
        .map(serveur => ({ ...serveur, type: "Serveur" }));

      const filteredStockagesExterne = stockagesExterne
        .filter(stockage => stockage.assigned_to === user.id)
        .map(stockage => ({ ...stockage, type: "Stockage Externe" }));  

      const allMaterials = [
        ...filteredComputers,
        ...filteredPhones,
        ...filteredPrinters,
        ...filteredScreens,
        ...filteredLogiciels,
        ...filteredPeripheriques,
        ...filteredRouteurs,
        ...filteredServeurs,
        ...filteredStockagesExterne,
      ];

      setAssignedMaterials(allMaterials);
    }
  }, [user, isOpen, computers, phones, printers, ecrants, logiciels, peripheriques, routeurs, serveurs, stockagesExterne]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8 relative">
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white hover:bg-slate-400 w-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations de l'utilisateur</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <strong className="text-gray-700">Nom d'utilisateur:</strong>
        <p className="text-gray-600">{userDetails.username}</p>
      </div>
      <div>
        <strong className="text-gray-700">Email:</strong>
        <p className="text-gray-600">{userDetails.email}</p>
      </div>
      <div>
        <strong className="text-gray-700">Prénom:</strong>
        <p className="text-gray-600">{userDetails.firstName}</p>
      </div>
      <div>
        <strong className="text-gray-700">Nom:</strong>
        <p className="text-gray-600">{userDetails.lastName}</p>
      </div>
      <div>
        <strong className="text-gray-700">Téléphone:</strong>
        <p className="text-gray-600">{userDetails.phone}</p>
      </div>
      <div>
        <strong className="text-gray-700">Rôle:</strong>
        <p className="text-gray-600">{userDetails.role}</p>
      </div>
      <div>
        <strong className="text-gray-700">Service:</strong>
        <p className="text-gray-600">{userDetails.service}</p>
      </div>
      <div>
        <strong className="text-gray-700">Département:</strong>
        <p className="text-gray-600">{userDetails.department}</p>
      </div>
      <div>
        <strong className="text-gray-700">Statut:</strong>
        <p className="text-gray-600">{userDetails.isActive ? 'Actif' : 'Inactif'}</p>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Matériels Assignés</h3>
      {assignedMaterials.length > 0 ? (
        <ul className="list-disc pl-6 space-y-2">
          {assignedMaterials.map((material) => (
            <li key={material.id}>
              <strong className="text-indigo-600">{material.type}</strong> : nom :  
              <span className="text-gray-700"> {material.name}</span> - marque : 
              <span className="text-gray-700"> {material.marque}</span> - état :
              <span className="text-gray-700"> {material.etat}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Aucun matériel n'est actuellement assigné à cet utilisateur.</p>
      )}
    </div>

    <button
      className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => onEdit(user)}
    >
      Modifier
    </button>
  </div>
</div>

  );
};

export default UserDetails;