import React from 'react';
import { Bus, Users, Activity } from 'lucide-react';

export default function BusList({ buses, routes, selectedRoute }) {
  const filteredBuses = selectedRoute
    ? buses.filter((b) => b.routeId === selectedRoute)
    : buses;
  
  if (filteredBuses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Bus size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">Tidak ada bus aktif saat ini</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bus size={24} className="text-blue-600" />
          Bus Aktif Sekarang
        </h3>
        <span className="text-sm text-gray-600">
          {filteredBuses.length} bus tersedia
        </span>
      </div>
      
      {filteredBuses.map((bus) => {
        const route = routes.find((r) => r.id === bus.routeId);
        const crowdLevel = bus.getCrowdLevel();
        const avgSpeed = bus.getAverageSpeed();
        
        return (
          <div
            key={bus.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4"
            style={{ borderColor: route?.color || '#3b82f6' }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-gray-800">
                    Bus {bus.id}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: route?.color }}
                  >
                    {route?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{route?.path}</p>
              </div>
              
              <div className="text-right">
                <div
                  className="text-xs px-3 py-1 rounded-full text-white font-bold mb-1"
                  style={{ backgroundColor: crowdLevel.color }}
                >
                  {crowdLevel.level}
                </div>
                <p className="text-xs text-gray-500">
                  {crowdLevel.percentage}% terisi
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600">
                    Penumpang
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {bus.currentPassengers} / {bus.capacity}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-gray-600">
                    Kecepatan Rata-rata
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {avgSpeed > 0 ? `${avgSpeed.toFixed(1)} km/h` : 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Status: {bus.status === 'active' ? '✅ Aktif' : '⏸️ Tidak Aktif'}</span>
                <span>
                  Update terakhir: {new Date(bus.lastUpdated).toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}