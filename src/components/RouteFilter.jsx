import React from 'react';

export default function RouteFilter({ routes, selectedRoute, onSelectRoute }) {
  return (
    <div className="bg-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Rute:</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onSelectRoute(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              !selectedRoute 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua Rute
          </button>
          
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all shadow-md ${
                selectedRoute === route.id ? 'text-white' : 'bg-white text-gray-700'
              }`}
              style={{
                backgroundColor: selectedRoute === route.id ? route.color : undefined,
                border: selectedRoute !== route.id ? `2px solid ${route.color}` : undefined,
              }}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}