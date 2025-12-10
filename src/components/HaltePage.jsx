import React, { useState } from 'react'

export default function HaltePage() {
  const [selectedRoute, setSelectedRoute] = useState('all')

  // Data halte simpel (tanpa prodi)
  const halteData = [
    {
      id:  1,
      name: "Terminal Tembalang",
      description: "Titik keberangkatan utama Bus Dipyo",
      location: "Gerbang Utama UNDIP",
      allRoutes: true,
      emoji: "🚏",
      nextBus: "3 menit"
    },
    {
      id: 2,
      name: "FEB",
      description: "Fakultas Ekonomika & Bisnis",
      location: "Gedung FEB",
      routes:  ["Rute Utara"],
      emoji: "📊",
      nextBus: "5 menit"
    },
    {
      id: 3,
      name: "Teknik",
      description: "Fakultas Teknik",
      location: "Area Gedung Teknik",
      routes: ["Rute Utara"],
      emoji:  "⚙️",
      nextBus: "8 menit"
    },
    {
      id: 4,
      name: "FSM",
      description: "Fakultas Sains & Matematika",
      location: "Gedung E",
      routes: ["Rute Utara"],
      emoji:  "🔬",
      nextBus: "12 menit"
    },
    {
      id: 5,
      name: "FISIP",
      description: "Fakultas Ilmu Sosial & Politik",
      location: "Gedung FISIP",
      routes: ["Rute Selatan"],
      emoji: "🏛️",
      nextBus: "6 menit"
    },
    {
      id: 6,
      name: "Psikologi",
      description: "Fakultas Psikologi",
      location: "Gedung Psikologi",
      routes: ["Rute Selatan"],
      emoji: "🧠",
      nextBus: "10 menit"
    },
    {
      id: 7,
      name: "FKM",
      description: "Fakultas Kesehatan Masyarakat",
      location: "Gedung FKM",
      routes: ["Rute Timur"],
      emoji: "🏥",
      nextBus: "8 menit"
    },
    {
      id: 8,
      name: "Kedokteran",
      description:  "Fakultas Kedokteran",
      location: "Area FK & FKG",
      routes: ["Rute Barat"],
      emoji: "⚕️",
      nextBus: "14 menit"
    }
  ]

  const routes = [
    { id: 'all', name: 'Semua Halte', color: '#6B7280' },
    { id: 'utara', name: 'Rute Utara', color:  '#3B82F6' },
    { id: 'selatan', name: 'Rute Selatan', color: '#EF4444' },
    { id: 'timur', name: 'Rute Timur', color: '#10B981' },
    { id:  'barat', name: 'Rute Barat', color: '#F59E0B' }
  ]

  const filteredHalte = selectedRoute === 'all' 
    ? halteData 
    :  halteData.filter(h => {
        if (h.allRoutes) return true
        const routeMap = {
          'utara': 'Rute Utara',
          'selatan': 'Rute Selatan',
          'timur': 'Rute Timur',
          'barat': 'Rute Barat'
        }
        return h.routes?. includes(routeMap[selectedRoute])
      })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
          🚏 Halte Bus Dipyo
        </h2>
        <p className="text-blue-100 text-lg">
          Temukan halte terdekat di kampus UNDIP Tembalang
        </p>
      </div>

      {/* Filter Rute */}
      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-lg">
        <h3 className="font-bold mb-4 text-gray-800 text-lg">🔍 Filter Rute</h3>
        <div className="flex flex-wrap gap-3">
          {routes.map(route => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedRoute === route.id
                  ? 'text-white shadow-lg scale-105 transform'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor:  selectedRoute === route.id ? route.color : undefined
              }}
            >
              {route.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Menampilkan <strong>{filteredHalte.length}</strong> halte
        </p>
      </div>

      {/* Halte Cards */}
      <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHalte.map(halte => (
          <div 
            key={halte.id}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover: shadow-2xl transition-all hover:-translate-y-1"
          >
            {/* Emoji Header */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{halte.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800">{halte.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{halte.description}</p>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <p className="text-xs text-gray-500 font-medium mb-1">📍 Lokasi</p>
              <p className="text-sm text-gray-800 font-medium">{halte. location}</p>
            </div>

            {/* Next Bus */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">🚌 Bus berikutnya</p>
                  <p className="text-2xl font-bold text-blue-700">{halte.nextBus}</p>
                </div>
                <div className="text-3xl animate-bounce">🚌</div>
              </div>
            </div>

            {/* Routes Badge */}
            {halte.allRoutes ?  (
              <div className="bg-green-100 border border-green-300 p-3 rounded-xl text-center">
                <p className="text-xs text-green-700 font-bold">✨ SEMUA RUTE LEWAT SINI</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {halte. routes?.map((route, idx) => {
                  const routeColor = routes.find(r => r.name === route)?.color || '#6B7280'
                  return (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor:  routeColor }}
                    >
                      {route}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 p-6 rounded-2xl">
        <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2 text-lg">
          💡 Info Bus Dipyo
        </h3>
        <div className="grid grid-cols-1 md: grid-cols-2 gap-4 text-sm text-yellow-800">
          <div className="flex items-start gap-2">
            <span className="text-lg">✅</span>
            <div>
              <strong>GRATIS</strong> untuk mahasiswa & dosen (tunjukkan KTM)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">⏰</span>
            <div>
              <strong>Operasional: </strong> Senin-Jumat, 07:00-17:00
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">🔄</span>
            <div>
              <strong>Frekuensi:</strong> Setiap 15-20 menit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">❄️</span>
            <div>
              <strong>Fasilitas:</strong> Ber-AC, GPS Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}