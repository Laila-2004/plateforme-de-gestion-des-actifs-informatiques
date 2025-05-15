import React, { useState } from 'react';
import MaterielTable from './MaterielTable';

const MaterielTabs = () => {
  const [activeTab, setActiveTab] = useState('Ordinateurs');
  const tabs = ['Ordinateurs', 'Écrans', 'Imprimantes', 'Téléphones'];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600 bg-white hover:bg-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-green-400 bg-green-200'
                }
              `}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <MaterielTable type={activeTab} />
      </div>
    </div>
  );
};

export default MaterielTabs;