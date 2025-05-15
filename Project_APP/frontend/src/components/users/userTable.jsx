import React from 'react';
import PropTypes from 'prop-types';

const UserTable = ({ 
  users, 
  onSelect, 
  onSort, 
  sortField, 
  sortDirection, 
  loading 
}) => {
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const renderCell = (user, field) => {
    switch (field) {
      case 'username':
        return user.username;
      case 'email':
        return user.email || '—';
      case 'department':
        return user.service_details?.department_details?.name || '—';
      case 'role':
        return user.role || '—';
      case 'service':
        return user.service_details?.name || '—'; 
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {user.is_active ? 'Actif' : 'Inactif'}
          </span>
        );
    }
  };

  const columns = [
    { field: 'username', label: 'Nom d\'utilisateur' },
    { field: 'email', label: 'Email' },
    { field: 'service',label: 'Service'},
    { field: 'department', label: 'Département' },
    { field: 'role', label: 'Rôle' },
    { field: 'status', label: 'Statut', sortable: false },
  ];

  if (users.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.field}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                onClick={() => col.sortable !== false && onSort(col.field)}
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <span>{col.label}</span>
                  {col.sortable !== false && (
                    <span className="flex-shrink-0">
                      {renderSortIcon(col.field)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelect(user)}
            >
              {columns.map(col => (
                <td key={`${user.id}-${col.field}`} className="px-6 py-4 whitespace-nowrap">
                  <div className={col.field === 'username' ? 'font-medium text-gray-900' : 'text-gray-500'}>
                    {renderCell(user, col.field)}
                  </div>
                </td>
              ))}
          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  loading: PropTypes.bool
};

UserTable.defaultProps = {
  onSort: () => {},
  sortField: 'username',
  sortDirection: 'asc',
  loading: false
};

export default UserTable;