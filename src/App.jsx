import React, { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import MapView from './components/MapView'
import AIChat from './components/AIChat'
import ReviewPage from './components/ReviewPage'
import HaltePage from './components/HaltePage'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('map')
  const [showProfile, setShowProfile] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
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

  const busData = [
    { id:  1, name: "Bus Dipyo 1", rute: "Terminal → FEB → Teknik → FSM", eta: 5, penumpang: 18, status: "Aktif", color: "#3B82F6" },
    { id: 2, name: "Bus Dipyo 2", rute: "Terminal → FISIP → Psikologi → Hukum", eta: 8, penumpang: 15, status: "Aktif", color: "#EF4444" },
    { id: 3, name: "Bus Dipyo 3", rute: "Terminal → FKM → FIB → Vokasi", eta: 12, penumpang: 12, status: "Aktif", color: "#10B981" },
    { id: 4, name: "Bus Dipyo 4", rute: "Terminal → Perikanan → Kedokteran", eta: 15, penumpang: 22, status: "Delay", color: "#F59E0B" }
  ]

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
    const file = e.target. files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData({...editData, foto: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  // Show splash screen first
  if (isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

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
                onClick={() => setShowProfile(! showProfile)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover: shadow-lg transition-all"
              >
                <span className="text-sm">👤 Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - USER FOKUS */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'map' 
                ?  'border-blue-500 text-blue-600' 
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
                : 'border-transparent text-gray-500 hover: text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">📅 Jadwal & Rute</div>
              <div className="text-xs text-gray-400">Schedule & routes</div>
            </button>

            <button
              onClick={() => setActiveTab('halte')}
              className={`py-4 px-2 border-b-2 font-medium transition-all ${
                activeTab === 'halte' 
                ?  'border-green-500 text-green-600' 
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
              
              {/* MapView Component */}
              <MapView />
            </div>

            {/* Bus Status Cards */}
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
                  </div>
                  
                  {/* Capacity Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Kapasitas</span>
                      <span>{Math.round((bus.penumpang/30) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(bus.penumpang/30) * 100}%`,
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
          <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
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
                color:  "green", 
                route:  "Terminal → FKM → FIB → Vokasi", 
                time: "07:00 - 17:00", 
                freq:  "25 menit", 
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
                  <p><strong>🏫 Melayani:</strong> {route. fakultas}</p>
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
          style={{ zIndex:  9999 }}
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
                  onClick={() => setIsEditingProfile(! isEditingProfile)}
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
                
                {isEditingProfile ?  (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({... editData, name: e.target.value})}
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
                      value={editData. jurusan}
                      onChange={(e) => setEditData({... editData, jurusan: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus: ring-blue-500 focus: border-transparent"
                    >
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
              
              {/* Statistics - UPDATED */}
              {! isEditingProfile && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-700">📊 Statistik Bulan Ini</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                      <div className="text-xs text-gray-600 font-medium">Total Trip</div>
                      <div className="text-xs text-blue-500 mt-1">🚌</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">8. 5</div>
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
                      🏆 Eco Warrior Badge!  Kamu udah hemat 12kg emisi CO₂ bulan ini! 
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