import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Laptop, Printer, Phone, Monitor, AlertCircle, Clock, CheckCircle, Users, Activity } from 'lucide-react';

//Import des services API
import { getAllComputers } from '../../services/api/materielService';
import { getAllPrinters } from '../../services/api/materielService';
import { getAllPhones } from '../../services/api/materielService';
import { getAllEcrants } from '../../services/api/materielService';
import { getAllTickets } from '../../services/api/ticketService';
import { getAllUsers } from '../../services/api/userService';
import { getAllDepartments } from '../../services/api/departmentService';
import { getAllServices } from '../../services/api/serviceService';

const Dashboard = () => {
  // États pour stocker les données
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [computers, setComputers] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [phones, setPhones] = useState([]);
  const [screens, setScreens] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupération des données en parallèle
        const [
          ticketsData, 
          usersData, 
          computersData, 
          printersData, 
          phonesData, 
          screensData,
          departmentsData
        ] = await Promise.all([
          getAllTickets(),
          getAllUsers(),
          getAllComputers(),
          getAllPrinters(),
          getAllPhones(),
          getAllEcrants(),
          getAllDepartments()
        ]);

        setTickets(ticketsData);
        setUsers(usersData);
        setComputers(computersData);
        setPrinters(printersData);
        setPhones(phonesData);
        setScreens(screensData);
        setDepartments(departmentsData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur s'est produite lors du chargement des données.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Préparation des données pour les graphiques
  const prepareTicketStatusData = () => {
    if (!tickets.length) return [];
    
    const statusCounts = {
      'ouvert': 0,
      'en_cours': 0,
      'fermé': 0
    };
    
    tickets.forEach(ticket => {
      if (statusCounts.hasOwnProperty(ticket.status)) {
        statusCounts[ticket.status]++;
      }
    });
    
    return Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: statusCounts[status]
    }));
  };

  const prepareTicketCategoryData = () => {
    if (!tickets.length) return [];
    
    const categoryCounts = {};
    
    tickets.forEach(ticket => {
      if (!categoryCounts[ticket.category]) {
        categoryCounts[ticket.category] = 0;
      }
      categoryCounts[ticket.category]++;
    });
    
    return Object.keys(categoryCounts).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      count: categoryCounts[category]
    }));
  };

  const prepareEquipmentData = () => {
    return [
      { name: 'Ordinateurs', count: computers.length, color: '#0088FE' },
      { name: 'Imprimantes', count: printers.length, color: '#00C49F' },
      { name: 'Téléphones', count: phones.length, color: '#FFBB28' },
      { name: 'Écrans', count: screens.length, color: '#FF8042' },
    ];
  };

  const prepareEquipmentStateData = () => {
    if (!computers.length && !printers.length && !phones.length && !screens.length) return [];
    
    const allEquipment = [...computers, ...printers, ...phones, ...screens];
    const stateCounts = {
      'en_marche': 0,
      'en_panne': 0
    };
    
    allEquipment.forEach(equip => {
      if (stateCounts.hasOwnProperty(equip.etat)) {
        stateCounts[equip.etat]++;
      }
    });
    
    return Object.keys(stateCounts).map(state => ({
      name: state === 'en_marche' ? 'En marche' : 'En panne',
      value: stateCounts[state]
    }));
  };

  const prepareUserRoleData = () => {
    if (!users.length) return [];
    
    const roleCounts = {
      'admin': 0,
      'technicien': 0,
      'utilisateurNormal': 0
    };
    
    users.forEach(user => {
      if (roleCounts.hasOwnProperty(user.role)) {
        roleCounts[user.role]++;
      }
    });
    
    return Object.keys(roleCounts).map(role => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: roleCounts[role]
    }));
  };

  const prepareTicketPriorityData = () => {
    if (!tickets.length) return [];
    
    const priorityCounts = {
      'faible': 0,
      'moyenne': 0,
      'haute': 0,
      'critique': 0
    };
    
    tickets.forEach(ticket => {
      if (priorityCounts.hasOwnProperty(ticket.priority)) {
        priorityCounts[ticket.priority]++;
      }
    });
    
    return Object.keys(priorityCounts).map(priority => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: priorityCounts[priority]
    }));
  };

  // Calcul des statistiques générales
  const stats = {
    totalUsers: users.length,
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'ouvert').length,
    inProgressTickets: tickets.filter(t => t.status === 'en_cours').length,
    closedTickets: tickets.filter(t => t.status === 'fermé').length,
    totalEquipment: computers.length + printers.length + phones.length + screens.length,
    brokenEquipment: [...computers, ...printers, ...phones, ...screens].filter(e => e.etat === 'en_panne').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de bord administrateur</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Utilisateurs</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Laptop size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Équipements</p>
            <p className="text-2xl font-bold">{stats.totalEquipment}</p>
            <p className="text-xs text-red-500">{stats.brokenEquipment} en panne</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <AlertCircle size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tickets ouverts</p>
            <p className="text-2xl font-bold">{stats.openTickets}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Activity size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tickets en cours</p>
            <p className="text-2xl font-bold">{stats.inProgressTickets}</p>
          </div>
        </div>
      </div>
      
      {/* Première rangée de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Statut des tickets */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statut des tickets</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareTicketStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareTicketStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Types d'équipements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Types d'équipements</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareEquipmentData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8">
                  {prepareEquipmentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Deuxième rangée de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* État des équipements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">État des équipements</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareEquipmentStateData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#00C49F" />
                  <Cell key="cell-1" fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Répartition des utilisateurs par rôle */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition des utilisateurs par rôle</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareUserRoleData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareUserRoleData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Troisième rangée de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets par catégorie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tickets par catégorie</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareTicketCategoryData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Tickets par priorité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tickets par priorité</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareTicketPriorityData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#82ca9d" /> {/* faible */}
                  <Cell key="cell-1" fill="#8884d8" /> {/* moyenne */}
                  <Cell key="cell-2" fill="#ffc658" /> {/* haute */}
                  <Cell key="cell-3" fill="#ff8042" /> {/* critique */}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;