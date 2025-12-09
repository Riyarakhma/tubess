import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default. mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = () => {
  // State untuk tile layer yang aktif
  const [activeTileLayer, setActiveTileLayer] = useState('google-street')
  
  // Google Maps style tile layers
  const tileLayerOptions = {
    'google-street': {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps',
      name: '🗺️ Street'
    },
    'google-satellite': {
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps',
      name: '🛰️ Satellite'
    },
    'google-hybrid': {
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps', 
      name: '🌍 Hybrid'
    },
    'google-terrain': {
      url: "https://mt1.google. com/vt/lyrs=p&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps',
      name: '🏔️ Terrain'
    }
  }

  // Custom Bus Icons - Hanya ini yang berwarna! 
  const createBusIcon = (routeId, busNumber) => {
    const colors = { 
      1: '#3B82F6', // Blue
      2: '#EF4444', // Red
      3: '#10B981', // Green
      4: '#F59E0B'  // Orange
    }
    
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div style="
          background: ${colors[routeId]}; 
          color: white; 
          border: 3px solid white;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          animation: busFloat 3s ease-in-out infinite;
        ">
          🚌${busNumber}
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    })
  }

  // Custom Halte Icons - Google Maps Style (abu-abu dengan tulisan putih)
  const createHalteIcon = (emoji, name) => {
    return L.divIcon({
      className: 'custom-halte-marker',
      html: `
        <div style="
          background: rgba(60, 64, 67, 0.9);
          color: white;
          border: 2px solid white;
          border-radius: 8px;
          padding: 6px 10px;
          font-family: 'Roboto', Arial, sans-serif;
          font-size: 11px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          text-align: center;
          min-width: 60px;
          backdrop-filter: blur(4px);
        ">
          <div style="font-size: 14px; margin-bottom: 2px;">${emoji}</div>
          <div style="font-size: 10px; letter-spacing: 0.3px;">${name. toUpperCase()}</div>
        </div>
      `,
      iconSize: [70, 35],
      iconAnchor: [35, 35],
      popupAnchor: [0, -35]
    })
  }

  // Koordinat REAL UNDIP Tembalang
  const undipCenter = [-7.0505, 110.4385] 
  
  // Area bounds UNDIP
  const undipBounds = {
    southwest: [-7.0650, 110.4200], 
    northeast: [-7.0350, 110.4550]  
  }
  
  // Halte-halte di UNDIP dengan nama yang sesuai Google Maps
  const haltes = [
    { id: 1, name: "Terminal", lat: -7.0520, lng: 110.4370, fakultas: "Terminal Tembalang UNDIP", emoji: "🚏" },
    { id: 2, name: "FEB", lat: -7.0500, lng: 110.4390, fakultas: "Fakultas Ekonomika dan Bisnis", emoji: "🏢" },
    { id: 3, name: "Teknik", lat: -7.0515, lng: 110.4395, fakultas: "Fakultas Teknik", emoji: "🏗️" },
    { id: 4, name: "FSM", lat: -7.0505, lng: 110.4380, fakultas: "Fakultas Sains dan Matematika", emoji: "🔬" },
    { id: 5, name: "FKM", lat: -7.0485, lng: 110.4400, fakultas: "Fakultas Kesehatan Masyarakat", emoji: "🏥" },
    { id: 6, name: "FISIP", lat: -7.0495, lng: 110.4385, fakultas: "Fakultas Ilmu Sosial dan Ilmu Politik", emoji: "🏛️" },
    { id: 7, name: "Psikologi", lat: -7.0510, lng: 110.4375, fakultas: "Fakultas Psikologi", emoji: "🧠" },
    { id: 8, name: "Hukum", lat: -7.0525, lng: 110.4360, fakultas: "Fakultas Hukum", emoji: "⚖️" },
    { id: 9, name: "Perikanan", lat: -7.0530, lng: 110.4350, fakultas: "Fakultas Perikanan dan Ilmu Kelautan", emoji: "🐟" },
    { id: 10, name: "FIB", lat: -7.0490, lng: 110.4405, fakultas: "Fakultas Ilmu Budaya", emoji: "📚" },
    { id: 11, name: "Vokasi", lat: -7.0480, lng: 110.4410, fakultas: "Sekolah Vokasi", emoji: "🎓" },
    { id: 12, name: "Kedokteran", lat: -7.0535, lng: 110.4345, fakultas: "Fakultas Kedokteran", emoji: "⚕️" }
  ]

  // Bus dalam kampus
  const [buses, setBuses] = useState([
    { id: 1, name: "Bus Dipyo 1", lat: -7.0500, lng: 110.4390, rute: 1, penumpang: 18, speed: 25 },
    { id: 2, name: "Bus Dipyo 2", lat: -7.0495, lng: 110.4385, rute: 2, penumpang: 15, speed: 22 },
    { id: 3, name: "Bus Dipyo 3", lat: -7.0485, lng: 110.4400, rute: 3, penumpang: 12, speed: 20 },
    { id: 4, name: "Bus Dipyo 4", lat: -7.0525, lng: 110.4360, rute: 4, penumpang: 22, speed: 18 }
  ])

  // Animasi pergerakan bus
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          const campusBounds = {
            north: -7.0450,   
            south: -7.0580,   
            east: 110.4450,   
            west: 110.4300    
          }
          
          const moveSpeed = 0.0005
          const newLat = bus.lat + (Math.random() - 0.5) * moveSpeed
          const newLng = bus.lng + (Math.random() - 0.5) * moveSpeed
          
          const boundedLat = Math.max(campusBounds.south, Math.min(campusBounds. north, newLat))
          const boundedLng = Math.max(campusBounds.west, Math.min(campusBounds. east, newLng))
          
          return {
            ...bus,
            lat: boundedLat,
            lng: boundedLng,
            penumpang: Math. max(5, Math.min(30, bus.penumpang + Math.floor(Math.random() * 3) - 1)),
            speed: Math.max(15, Math.min(30, bus.speed + Math.floor(Math.random() * 3) - 1))
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Rute dengan jalur yang realistis - Warna lebih subtle
  const routes = {
    1: [
      [-7.0520, 110.4370], // Terminal
      [-7.0500, 110.4390], // FEB
      [-7.0515, 110.4395], // Teknik
      [-7.0505, 110.4380], // FSM
      [-7.0490, 110.4385]  
    ],
    2: [
      [-7.0520, 110.4370], // Terminal
      [-7.0495, 110.4385], // FISIP
      [-7.0510, 110.4375], // Psikologi
      [-7.0525, 110.4360], // Hukum
      [-7.0520, 110.4370]  
    ],
    3: [
      [-7.0520, 110.4370], // Terminal
      [-7.0485, 110.4400], // FKM
      [-7.0490, 110.4405], // FIB
      [-7.0480, 110.4410], // Vokasi
      [-7.0500, 110.4395]  
    ],
    4: [
      [-7.0520, 110.4370], // Terminal
      [-7.0530, 110.4350], // Perikanan
      [-7.0535, 110.4345], // Kedokteran
      [-7.0520, 110.4370]  
    ]
  }

  // Warna rute yang lebih subtle (tidak terlalu mencolok)
  const routeColors = { 
    1: 'rgba(59, 130, 246, 0. 7)',   // Blue dengan transparansi
    2: 'rgba(239, 68, 68, 0. 7)',   // Red dengan transparansi
    3: 'rgba(16, 185, 129, 0.7)',  // Green dengan transparansi
    4: 'rgba(245, 158, 11, 0.7)'   // Orange dengan transparansi
  }

  const routeNames = {
    1: 'Rute Utara (FEB-Teknik-FSM)',
    2: 'Rute Selatan (FISIP-Psikologi-Hukum)', 
    3: 'Rute Timur (FKM-FIB-Vokasi)',
    4: 'Rute Barat (Perikanan-Kedokteran)'
  }

  return (
    <div className="relative">
      <div style={{ height: '450px', width: '100%' }} className="rounded-xl overflow-hidden shadow-lg">
        <MapContainer 
          center={undipCenter} 
          zoom={16}  
          style={{ height: '100%', width: '100%' }}
          maxBounds={[
            undipBounds.southwest, 
            undipBounds.northeast
          ]}
          minZoom={14}
          maxZoom={20}
        >
          {/* Google Maps Style Tile Layer */}
          <TileLayer 
            key={activeTileLayer}
            url={tileLayerOptions[activeTileLayer]. url}
            attribution={tileLayerOptions[activeTileLayer].attribution}
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
          
          {/* Rute Lines yang subtle */}
          {Object.entries(routes). map(([routeId, coordinates]) => (
            <Polyline 
              key={routeId}
              positions={coordinates}
              color={routeColors[routeId]}
              weight={6}
              opacity={0.8}
              dashArray="10, 5"
            />
          ))}
          
          {/* Halte Markers - Google Maps Style */}
          {haltes. map(halte => (
            <Marker 
              key={halte.id} 
              position={[halte.lat, halte.lng]}
              icon={createHalteIcon(halte.emoji, halte.name)}
            >
              <Popup maxWidth={300}>
                <div className="text-center p-4">
                  <h3 className="font-bold text-lg text-gray-700 mb-3">
                    {halte.emoji} Halte {halte.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{halte.fakultas}</p>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all">
                      📅 Lihat Jadwal Bus
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-600 transition-colors">
                        📍 Navigasi
                      </button>
                      <button className="bg-gray-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-600 transition-colors">
                        🔔 Notifikasi
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bus Markers - Tetap berwarna cerah */}
          {buses.map(bus => (
            <Marker 
              key={bus. id} 
              position={[bus. lat, bus.lng]}
              icon={createBusIcon(bus.rute, bus.id)}
            >
              <Popup maxWidth={320}>
                <div className="text-center p-4">
                  <h3 className="font-bold text-xl text-blue-600 mb-3 flex items-center justify-center gap-2">
                    🚌 {bus.name}
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      🟢 Live
                    </span>
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1 text-blue-600">
                          Rute {bus.rute}
                        </div>
                        <div className="text-xs text-gray-500">Jalur</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-green-600 mb-1">
                          {bus.penumpang}/30
                        </div>
                        <div className="text-xs text-gray-500">Penumpang</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-orange-600 mb-1">
                          {bus.speed} km/h
                        </div>
                        <div className="text-xs text-gray-500">Kecepatan</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      🛣️ {routeNames[bus. rute]}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Kapasitas Bus</span>
                        <span>{Math.round((bus.penumpang/30) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 rounded-full transition-all duration-500 flex items-center justify-center"
                          style={{ 
                            width: `${(bus. penumpang/30) * 100}%`,
                            backgroundColor: bus.rute === 1 ? '#3B82F6' : bus.rute === 2 ? '#EF4444' : bus.rute === 3 ? '#10B981' : '#F59E0B'
                          }}
                        >
                          <span className="text-white text-xs font-bold">
                            {Math.round((bus. penumpang/30) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg text-sm hover:shadow-lg transition-all font-medium">
                      📱 Track Real-time
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600 transition-colors">
                        🔔 Notifikasi
                      </button>
                      <button className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-orange-600 transition-colors">
                        📊 Detail Info
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Google Maps Style Switcher */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border">
        <h4 className="font-bold text-xs mb-2 text-gray-700">🗺️ Map View</h4>
        <div className="space-y-1">
          {Object.entries(tileLayerOptions). map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveTileLayer(key)}
              className={`text-xs px-3 py-2 rounded-lg transition-all w-full text-left font-medium ${
                activeTileLayer === key 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Legend - Google Style */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
        <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-700">
          🎓 <span>UNDIP Tembalang</span>
        </h4>
        <div className="space-y-2">
          {Object.entries({1: '#3B82F6', 2: '#EF4444', 3: '#10B981', 4: '#F59E0B'}).map(([rute, color]) => (
            <div key={rute} className="flex items-center gap-3 text-xs">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="font-medium text-gray-700">Bus Dipyo {rute}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>🚌 Live GPS Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>🚏 {haltes.length} Halte Kampus</span>
          </div>
        </div>
      </div>

      {/* Campus Info - Google Style */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border">
        <div className="text-center">
          <div className="text-xl mb-2">🎓</div>
          <div className="font-bold text-sm text-gray-800">UNDIP Tembalang</div>
          <div className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Tracking
          </div>
          <div className="text-xs text-gray-500 mt-1">Semarang</div>
        </div>
      </div>
    </div>
  )
}

export default MapView