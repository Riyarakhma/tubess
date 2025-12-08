import React from 'react';
import { MapPin, Clock, Star, Bus } from 'lucide-react';

export default function HalteList({ 
  haltes, 
  buses, 
  routes, 
  favorites, 
  onToggleFavorite,
  selectedRoute 
}) {
  const filteredHaltes = selectedRoute
    ? haltes.filter((h) => h.routeId === selectedRoute)
    : haltes;
  
  const getNearbyBuses = (halte) => {
    return buses.filter((bus) => {
      const eta = bus.calculateETA(halte);
      return eta <= 15; // Tampilkan bus yang akan tiba dalam 15 menit
    });
  };
  
  if (filteredHaltes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">Tidak ada halte tersedia</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <MapPin size={24} className="text-blue-600" />
          Daftar Halte
        </h3>
        <span className="text-sm text-gray-600">
          {filteredHaltes.length} halte
        </span>
      </div>
      
      {filteredHaltes.map((halte) => {
        const isFavorite = favorites.includes(halte.id);
        const route = routes.find((r) => r.id === halte.routeId);
        const nearbyBuses = getNearbyBuses(halte);
        
        return (
          <div
            key={halte.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4"
            style={{ borderColor: route?.color || '#3b82f6' }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-1">
                  <MapPin size={18} style={{ color: route?.color }} />
                  {halte.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: route?.color }}
                  >
                    {route?.name}
                  </span>
                  <span className="text-xs text-gray-500">{route?.path}</span>
                </div>
              </div>
              
              <button
                onClick={() => onToggleFavorite(halte.id)}
                className={`p-2 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            {/* Location Info */}
            <div className="mb-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
              📍 Koordinat: {halte.lat.toFixed(6)}, {halte.lng.toFixed(6)}
            </div>
            
            {/* Nearby Buses */}
            {nearbyBuses.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Bus size={16} className="text-blue-600" />
                  <span>Bus yang akan tiba:</span>
                </div>
                
                {nearbyBuses.map((bus) => {
                  const eta = bus.calculateETA(halte);
                  const crowdLevel = bus.getCrowdLevel();
                  
                  return (
                    <div
                      key={bus.id}
                      className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: route?.color }}
                        >
                          {bus.id}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            Bus {bus.id}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: crowdLevel.color }}
                            />
                            <span className="text-xs text-gray-600">
                              {crowdLevel.level} ({bus.currentPassengers}/{bus.capacity})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-blue-600 font-bold">
                          <Clock size={16} />
                          <span className="text-lg">~{eta}</span>
                        </div>
                        <span className="text-xs text-gray-600">menit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  ⏰ Tidak ada bus dalam 15 menit
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}