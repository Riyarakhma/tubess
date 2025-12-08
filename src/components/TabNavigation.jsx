import React from 'react';
import { Navigation, MapPin, Bus, Star } from 'lucide-react';

export default function TabNavigation({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'map', label: 'Map', icon: Navigation },
    { id: 'haltes', label: 'Halte', icon: MapPin },
    { id: 'buses', label: 'Bus', icon: Bus },
    { id: 'favorites', label: 'Favorit', icon: Star },
  ];
  
  return (
    <div className="bg-white border-b shadow-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}