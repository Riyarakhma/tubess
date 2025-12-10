import React, { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import MapView from './components/MapView'
import AIChat from './components/AIChat'
import ReviewPage from './components/ReviewPage'
import HaltePage from './components/HaltePage'

// Import OOP Classes
import {
  BusManager,
  ACBus,
  ElectricBus,
  Bus,
  Halte,
  BusFullException,
  BusNotFoundException,
  HalteNotFoundException,
  BusSystemException
} from './utils/BusOOP'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('map')
  const [showProfile, setShowProfile] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  
  // OOP Manager Instance - Main controller untuk semua bus operations
  const [busManager] = useState(() => new BusManager())
  const [buses, setBuses] = useState([])

  const [userProfile, setUserProfile] = useState({
    name: "biell rhma yasmin",
    nim: "211201231401",
    fakultas: "Teknik", 
    jurusan: "Teknik Komputer",
    email: "tekkom@students.undip.ac.id",
    phone: "081234567890",
    alamat: "Jl. Prof. Soedarto, Tembalang, Semarang",
    foto: "https://via.placeholder.com/80/4F46E5/FFFFFF?text=AM"
  })

  const [editData, setEditData] = useState(userProfile)

  // Initialize OOP System
  useEffect(() => {
    try {
      console.log('🚀 Initializing OOP Bus System...')

      // Create different types of buses (Polymorphism & Inheritance)
      const bus1 = new ACBus(1, 'Bus Dipyo 1', 1, -7.0500, 110.4390, 22) // AC Bus dengan temp 22°C
      const bus2 = new ElectricBus(2, 'Bus Dipyo 2', 2, -7.0495, 110.4385, 85) // Electric Bus dengan battery 85%
      const bus3 = new Bus(3, 'Bus Dipyo 3', 3, -7.0485, 110.4400) // Standard Bus
      const bus4 = new ACBus(4, 'Bus Dipyo 4', 4, -7.0525, 110.4360, 20) // AC Bus dengan temp 20°C

      // Set initial properties using OOP methods
      bus1.addPassenger(18)
      bus1.setSpeed(25)
      bus1.eta = 5

      bus2.addPassenger(15)
      bus2.setSpeed(22)
      bus2.eta = 8

      bus3.addPassenger(12)
      bus3.setSpeed(20)
      bus3.eta = 12

      bus4.addPassenger(22)
      bus4.setSpeed(18)
      bus4.eta = 15
      bus4.setStatus('Delay')

      // Add buses to manager (Encapsulation)
      busManager.addBus(bus1)
      busManager.addBus(bus2)
      busManager.addBus(bus3)
      busManager.addBus(bus4)

      // Create Haltes using OOP
      const terminal = new Halte(1, 'Terminal', -7.0520, 110.4370, 'Terminal Tembalang UNDIP')
      const feb = new Halte(2, 'FEB', -7.0500, 110.4390, 'Fakultas Ekonomika dan Bisnis')
      const teknik = new Halte(3, 'Teknik', -7.0515, 110.4395, 'Fakultas Teknik')
      const fsm = new Halte(4, 'FSM', -7.0505, 110.4380, 'Fakultas Sains dan Matematika')

      // Add facilities and routes to haltes
      terminal.addFacility('Shelter')
      terminal.addFacility('Security')
      terminal.addFacility('Information Desk')
      terminal.addRoute(1)
      terminal.addRoute(2)
      terminal.addRoute(3)
      terminal.addRoute(4)

      feb.addFacility('Shelter')
      feb.addFacility('Kantin')
      feb.addRoute(1)

      busManager.addHalte(terminal)
      busManager.addHalte(feb)
      busManager.addHalte(teknik)
      busManager.addHalte(fsm)

      // Initialize buses state
      setBuses(busManager.getAllBuses())

      // Log system stats (menggunakan OOP methods)
      console.log('✅ OOP System Initialized')
      console.log('📊 System Stats:', busManager.getSystemStats())
      console.log('🚌 Active Buses:', busManager.getActiveBuses().length)

      // Demo Polymorphism - getInfo() berbeda untuk setiap tipe bus
      busManager.getAllBuses().forEach(bus => {
        console.log(`${bus.name} Info:`, bus.getInfo())
      })

    } catch (error) {
      console.error('❌ Initialization Error:', error.message)
      if (error instanceof BusSystemException) {
        console.error('Error Code:', error.code)
        console.error('Timestamp:', error.timestamp)
      }
    }
  }, [busManager])

  // Simulate Bus Movement with OOP methods & Exception Handling
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const allBuses = busManager.getAllBuses()
        
        allBuses.forEach(bus => {
          // Update location using OOP method
          const newLat = bus.location.lat + (Math.random() - 0.5) * 0.0005
          const newLng = bus.location.lng + (Math.random() - 0.5) * 0.0005
          bus.updateLocation(newLat, newLng)
          
          // Passenger simulation with Exception Handling
          try {
            // Random passenger boarding
            if (Math.random() > 0.7 && bus.penumpang < bus.capacity) {
              const count = Math.floor(Math.random() * 3) + 1
              bus.addPassenger(count) // OOP method dengan validation
            }
            
            // Random passenger alighting
            if (Math.random() > 0.8 && bus.penumpang > 5) {
              const count = Math.floor(Math.random() * 2) + 1
              bus.removePassenger(count) // OOP method dengan validation
            }
          } catch (error) {
            // Exception handling untuk bus operations
            if (error instanceof BusFullException) {
              console.log(`🚌 ${bus.name} penuh! Kapasitas: ${bus.capacity}`)
            } else if (error instanceof BusSystemException) {
              console.log(`⚠️ ${error.message}`)
            }
          }

          // Update speed using OOP method with validation
          try {
            const newSpeed = Math.max(15, Math.min(30, bus.speed + Math.floor(Math.random() * 3) - 1))
            bus.setSpeed(newSpeed) // Akan throw exception jika speed invalid
          } catch (error) {
            console.log('Speed update error:', error.message)
          }

          // Special operations untuk specialized buses (Polymorphism)
          if (bus instanceof ElectricBus) {
            // Electric bus konsumsi battery
            if (bus.batteryLevel > 0) {
              bus.batteryLevel = Math.max(20, bus.batteryLevel - 0.5)
            }
            if (bus.needsCharging()) {
              console.log(`🔋 ${bus.name} needs charging! Battery: ${bus.batteryLevel}%`)
            }
          }

          if (bus instanceof ACBus) {
            // AC bus auto adjust temperature
            if (bus.getOccupancyRate() > 70) {
              try {
                bus.setACTemp(20) // Lower temp when crowded
              } catch (error) {
                console.log('AC temp error:', error.message)
              }
            }
          }
        })

        // Update state
        setBuses([...allBuses])

      } catch (error) {
        console.error('Simulation error:', error.message)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [busManager])

  const handleSplashComplete = () => {
    setIsLoading(false)
  }

  const handleSaveProfile = () => {
    setUserProfile(editData)
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    setEditData(userProfile)
    setIsEditingProfile(false)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData({...editData, foto: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Convert OOP buses to display format
  // Menggunakan Polymorphism - getInfo() method yang berbeda untuk setiap tipe
  const busData = buses.map(bus => {
    const info = bus.getInfo() // Polymorphic call
    return {
      id: bus.id,
      name: bus.name,
      rute: `Terminal → ${info.rute === 1 ? 'FEB → Teknik → FSM' : info.rute === 2 ? 'FISIP → Psikologi → Hukum' : info.rute === 3 ? 'FKM → FIB → Vokasi' : 'Perikanan → Kedokteran'}`,
      eta: bus.eta,
      penumpang: bus.penumpang,
      status: bus.status,
      color: bus.id === 1 ? '#3B82F6' : bus.id === 2 ? '#EF4444' : bus.id === 3 ? '#10B981' : '#F59E0B',
      // Additional info from polymorphic getInfo()
      type: info.type || 'Standard',
      acTemp: info.acTemp,
      acStatus: info.acStatus,
      battery: info.battery,
      ecoFriendly: info.ecoFriendly,
      occupancyRate: bus.getOccupancyRate() // OOP method
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0" style={{ zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🚌</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bus Dipyo Tracker UNDIP
                </h1>
                <p className="text-sm text-gray-500">Tembalang Campus Live Tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 hover:bg-gray-100 rounded-lg relative cursor-pointer">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <span className="text-sm">👤 Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'map' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">🗺️ Live Map</div>
              <div className="text-xs text-gray-400">Real-time tracking</div>
            </button>
            
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'schedule' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">📅 Jadwal & Rute</div>
              <div className="text-xs text-gray-400">Schedule & routes</div>
            </button>

            <button
              onClick={() => setActiveTab('halte')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'halte' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">🚏 Halte & Info</div>
              <div className="text-xs text-gray-400">Bus stops</div>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'review' 
                  ? 'border-yellow-500 text-yellow-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">⭐ Review & Rating</div>
              <div className="text-xs text-gray-400">Student feedback</div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Live Map */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">🗺️ Live Map UNDIP Tembalang</h2>
                  <p className="text-gray-600">Real-time bus tracking dalam kampus UNDIP</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">Live GPS</span>
                </div>
              </div>
              
              <MapView />
            </div>

            {/* Bus Status Cards - Using OOP data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {busData.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-all"
                  style={{ borderLeftColor: bus.color }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">{bus.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bus.status === 'Aktif' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  {/* Bus Type Badge - dari polymorphic getInfo() */}
                  {bus.type && (
                    <div className="mb-3">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        {bus.type} Bus {bus.ecoFriendly && '🌱'}
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span className="text-xs">{bus.rute}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>👥</span>
                      <span>{bus.penumpang}/30 penumpang</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">ETA: </span>
                      <span className="font-bold text-blue-600">{bus.eta} menit</span>
                    </div>

                    {/* Special properties from OOP classes */}
                    {bus.acTemp && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>❄️</span>
                        <span>AC: {bus.acTemp} {bus.acStatus}</span>
                      </div>
                    )}
                    {bus.battery && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>🔋</span>
                        <span>Battery: {bus.battery}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Capacity Progress Bar - using OOP method */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Kapasitas</span>
                      <span>{bus.occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${bus.occupancyRate}%`,
                          backgroundColor: bus.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                title: "🔵 Rute 1 - Utara", 
                color: "blue", 
                route: "Terminal → FEB → Teknik → FSM", 
                time: "06:00 - 18:00", 
                freq: "15 menit", 
                fakultas: "Ekonomi, Teknik, Sains",
                halte: ["Terminal Tembalang", "FEB", "Teknik", "FSM"] 
              },
              { 
                title: "🔴 Rute 2 - Selatan", 
                color: "red", 
                route: "Terminal → FISIP → Psikologi → Hukum", 
                time: "06:30 - 17:30", 
                freq: "20 menit", 
                fakultas: "Sosial, Psikologi, Hukum",
                halte: ["Terminal Tembalang", "FISIP", "Psikologi", "Hukum"]
              },
              { 
                title: "🟢 Rute 3 - Timur", 
                color: "green", 
                route: "Terminal → FKM → FIB → Vokasi", 
                time: "07:00 - 17:00", 
                freq: "25 menit", 
                fakultas: "Kesehatan, Budaya, Vokasi",
                halte: ["Terminal Tembalang", "FKM", "FIB", "Vokasi"]
              },
              { 
                title: "🟡 Rute 4 - Barat", 
                color: "orange", 
                route: "Terminal → Perikanan → Kedokteran", 
                time: "06:45 - 17:45", 
                freq: "18 menit", 
                fakultas: "Perikanan, Kedokteran",
                halte: ["Terminal Tembalang", "Perikanan", "Kedokteran"]
              }
            ].map((route, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-lg font-bold mb-4 text-gray-700">{route.title}</h3>
                <div className="space-y-3 text-sm">
                  <p><strong>🛣️ Rute:</strong> {route.route}</p>
                  <p><strong>🏫 Melayani:</strong> {route.fakultas}</p>
                  <p><strong>🕐 Operasional:</strong> {route.time}</p>
                  <p><strong>⏱️ Frekuensi:</strong> Setiap {route.freq}</p>
                  <div>
                    <strong>🚏 Halte:</strong>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {route.halte.map((halte, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">{halte}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'halte' && <HaltePage />}
        {activeTab === 'review' && <ReviewPage />}
      </main>

      {/* Enhanced Profile Modal */}
      {showProfile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 9999 }}
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
            style={{ zIndex: 10000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                👤 User Profile
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    isEditingProfile 
                      ? 'bg-gray-500 text-white hover:bg-gray-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isEditingProfile ? '❌ Cancel' : '✏️ Edit'}
                </button>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Profile Photo & Basic Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={userProfile.foto} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover"
                  />
                  {isEditingProfile && (
                    <label className="absolute bottom-4 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {isEditingProfile ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama Lengkap"
                    />
                    <input
                      type="text"
                      value={editData.nim}
                      onChange={(e) => setEditData({...editData, nim: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="NIM"
                    />
                    <select
                      value={editData.jurusan}
                      onChange={(e) => setEditData({...editData, jurusan: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Teknik Komputer">Teknik Komputer</option>
                      <option value="Informatika">Informatika</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Statistika">Statistika</option>
                      <option value="Teknik Sipil">Teknik Sipil</option>
                      <option value="Teknik Mesin">Teknik Mesin</option>
                      <option value="Teknik Elektro">Teknik Elektro</option>
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Hukum">Hukum</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{userProfile.name}</h3>
                    <p className="text-gray-600 font-medium">NIM: {userProfile.nim}</p>
                    <p className="text-blue-600 font-medium">{userProfile.jurusan}</p>
                    <p className="text-gray-500">{userProfile.fakultas}</p>
                  </div>
                )}
              </div>
              
              {/* Statistics */}
              {!isEditingProfile && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-700">📊 Statistik Bulan Ini</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                      <div className="text-xs text-gray-600 font-medium">Total Trip</div>
                      <div className="text-xs text-blue-500 mt-1">🚌</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">8.5</div>
                      <div className="text-xs text-gray-600 font-medium">Jam Hemat</div>
                      <div className="text-xs text-green-500 mt-1">⏱️</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">12kg</div>
                      <div className="text-xs text-gray-600 font-medium">CO₂ Saved</div>
                      <div className="text-xs text-purple-500 mt-1">🌱</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-center text-green-700 font-medium">
                      🏆 Eco Warrior Badge! Kamu udah hemat 12kg emisi CO₂ bulan ini!
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isEditingProfile ? (
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    ❌ Batal
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    💾 Simpan Perubahan
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowProfile(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Tutup Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Component */}
      <AIChat />
    </div>
  )
}

export default App