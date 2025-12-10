import React, { useState } from 'react'
import { X, Mail, Phone, MapPin, Award, TrendingUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const UserProfile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "biell rhma yasmin",
    nim: "211201231401",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer", 
    email: "tekkom@students.undip.ac.id",
    phone: "081234567890",
    foto: "https://ui-avatars.com/api/? name=Ahmad+Mahasiswa&background=4F46E5&color=fff&size=200&bold=true"
  })

  const [editData, setEditData] = useState(userInfo)

  const [tripHistory] = useState([
    { id: 1, date: "2025-01-15", from: "Terminal", to: "FSM", bus: "Bus Dipyo 1", time: "08:30", status: "✅" },
    { id: 2, date: "2025-01-15", from: "FSM", to: "FEB", bus: "Bus Dipyo 1", time: "14:15", status: "✅" },
    { id: 3, date: "2025-01-14", from: "Terminal", to: "Teknik", bus: "Bus Dipyo 1", time: "07:45", status: "✅" },
    { id: 4, date: "2025-01-14", from: "Teknik", to: "Terminal", bus: "Bus Dipyo 1", time: "16:30", status: "✅" }
  ])

  const achievements = [
    { icon: "🏆", title: "Eco Warrior", desc: "12kg CO₂ tersimpan", color: "from-yellow-400 to-orange-500" },
    { icon: "🔥", title: "7 Day Streak", desc: "Konsisten naik bus", color: "from-red-400 to-pink-500" },
    { icon: "⭐", title: "Silver Rider", desc: "24 trips bulan ini", color: "from-gray-300 to-gray-500" }
  ]

  const handleSave = () => {
    setUserInfo(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(userInfo)
    setIsEditing(false)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData({ ...editData, foto: e. target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity:  1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden border-4 border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan Gradient Animated */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-8 overflow-hidden">
          {/* Animated Background Circles */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate:  [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-90 z-10"
          >
            <X size={20} />
          </button>
          
          {/* Profile Header */}
          <div className="relative z-10 flex items-center gap-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness:  300 }}
            >
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-white via-yellow-200 to-pink-200 shadow-2xl">
                <img
                  src={isEditing ? editData.foto :  userInfo.foto}
                  alt={userInfo.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-green-400 w-6 h-6 rounded-full border-4 border-white"
              />
            </motion. div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e. target.value })}
                    className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold text-xl"
                    placeholder="Nama Lengkap"
                  />
                  <input
                    type="text"
                    value={editData.nim}
                    onChange={(e) => setEditData({ ...editData, nim: e.target.value })}
                    className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus: ring-2 focus:ring-white/50"
                    placeholder="NIM"
                  />
                </div>
              ) : (
                <>
                  <motion.h2 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-2 drop-shadow-lg"
                  >
                    {userInfo. name}
                  </motion. h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                      📚 {userInfo.nim}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                      🎓 {userInfo.jurusan}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm">{userInfo.fakultas}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 max-h-[calc(95vh-320px)] overflow-y-auto custom-scrollbar">
          
          {/* Achievements - KEREN! */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" size={22} />
              Pencapaian Kamu
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((ach, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${ach.color} text-white p-4 rounded-2xl text-center shadow-lg cursor-pointer`}
                >
                  <div className="text-4xl mb-2">{ach.icon}</div>
                  <div className="text-xs font-bold mb-1">{ach.title}</div>
                  <div className="text-xs opacity-90">{ach.desc}</div>
                </motion. div>
              ))}
            </div>
          </motion. div>

          {/* Stats - GAMIFICATION */}
          {! isEditing && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y:  0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={22} />
                Statistik Bulan Ini
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale:  1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                    className="text-4xl font-bold mb-1"
                  >
                    24
                  </motion.div>
                  <div className="text-xs opacity-90">Total Trip</div>
                  <div className="text-2xl mt-1">🚌</div>
                </div>
                <div className="text-center border-x border-white/30">
                  <motion.div 
                    initial={{ scale:  0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className="text-4xl font-bold mb-1"
                  >
                    8. 5
                  </motion.div>
                  <div className="text-xs opacity-90">Jam Hemat</div>
                  <div className="text-2xl mt-1">⏱️</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6 }}
                    className="text-4xl font-bold mb-1"
                  >
                    12kg
                  </motion.div>
                  <div className="text-xs opacity-90">CO₂ Saved</div>
                  <div className="text-2xl mt-1">🌱</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Personal */}
          {!isEditing && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay:  0.4 }}
              className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-blue-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-blue-500" size={22} />
                Informasi Kontak
              </h3>
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                >
                  <MapPin size={18} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Fakultas</p>
                    <p className="text-sm font-bold text-gray-800">{userInfo.fakultas}</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl"
                >
                  <Mail size={18} className="text-green-500 flex-shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{userInfo.email}</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <Phone size={18} className="text-purple-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Telepon</p>
                    <p className="text-sm font-bold text-gray-800">{userInfo.phone}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Trip History */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y:  0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-blue-100"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              🕐 Riwayat Perjalanan Terakhir
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {tripHistory.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚌</span>
                        <span className="text-sm font-bold text-gray-800">{trip.bus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{trip.date}</span>
                        <span>{trip.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-medium text-xs">
                        {trip.from}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full font-medium text-xs">
                        {trip.to}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">🕐 {trip.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-blue-100">
          {isEditing ? (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                ❌ Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                💾 Simpan
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale:  1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                ✏️ Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-all"
              >
                Tutup
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UserProfile