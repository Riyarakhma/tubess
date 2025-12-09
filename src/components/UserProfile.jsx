import React, { useState } from 'react'
import { X, User, Mail, Phone, MapPin, Clock, Bus, Edit3, Save, Camera } from 'lucide-react'
import { motion } from 'framer-motion'

const UserProfile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Ahmad Mahasiswa",
    nim: "24020122140001",
    fakultas: "Fakultas Sains dan Matematika",
    jurusan: "Informatika", 
    email: "ahmad.mhs@students.undip.ac.id",
    phone: "081234567890",
    foto: "https://via.placeholder.com/80/4F46E5/FFFFFF?text=AM",
    alamat: "Jl. Prof. Soedarto, Tembalang, Semarang"
  })

  const [editData, setEditData] = useState(userInfo)

  const [tripHistory] = useState([
    { id: 1, date: "2025-12-08", from: "Terminal", to: "FSM", bus: "Bus Dipyo 1", time: "08:30", status: "✅" },
    { id: 2, date: "2025-12-08", from: "FSM", to: "FEB", bus: "Bus Dipyo 1", time: "14:15", status: "✅" },
    { id: 3, date: "2025-12-07", from: "Terminal", to: "Teknik", bus: "Bus Dipyo 1", time: "07:45", status: "✅" },
    { id: 4, date: "2025-12-07", from: "Teknik", to: "Terminal", bus: "Bus Dipyo 1", time: "16:30", status: "✅" }
  ])

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
      reader. onload = (e) => {
        setEditData({... editData, foto: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <button
            onClick={() => setIsEditing(! isEditing)}
            className="absolute top-4 right-16 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Edit3 size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={userInfo.foto}
                alt={userInfo.name}
                className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white text-gray-700 p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e. target.value})}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70"
                    placeholder="Nama Lengkap"
                  />
                  <select
                    value={editData.jurusan}
                    onChange={(e) => setEditData({...editData, jurusan: e. target.value})}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white"
                  >
                    <option value="Informatika">Informatika</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Biologi">Biologi</option>
                  </select>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold">{userInfo.name}</h2>
                  <p className="text-blue-100 text-sm">NIM: {userInfo.nim}</p>
                  <p className="text-blue-100 text-sm">{userInfo.jurusan}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Info Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Informasi Personal
              {isEditing && <span className="text-sm text-orange-500">(Mode Edit)</span>}
            </h3>
            
            <div className="space-y-3">
              {/* Fakultas */}
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                {isEditing ? (
                  <select
                    value={editData.fakultas}
                    onChange={(e) => setEditData({... editData, fakultas: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Fakultas Sains dan Matematika">Fakultas Sains dan Matematika</option>
                    <option value="Fakultas Teknik">Fakultas Teknik</option>
                    <option value="Fakultas Ekonomika dan Bisnis">Fakultas Ekonomika dan Bisnis</option>
                    <option value="Fakultas Hukum">Fakultas Hukum</option>
                    <option value="Fakultas Kesehatan Masyarakat">Fakultas Kesehatan Masyarakat</option>
                  </select>
                ) : (
                  <span className="text-gray-600 text-sm">{userInfo.fakultas}</span>
                )}
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                {isEditing ?  (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target. value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">{userInfo.email}</span>
                )}
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">{userInfo. phone}</span>
                )}
              </div>

              {/* Alamat */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-1" />
                {isEditing ? (
                  <textarea
                    value={editData.alamat}
                    onChange={(e) => setEditData({...editData, alamat: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                    rows={2}
                  />
                ) : (
                  <span className="text-gray-600 text-sm">{userInfo.alamat}</span>
                )}
              </div>
            </div>
          </div>

          {/* Trip History */}
          {! isEditing && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Riwayat Perjalanan
              </h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tripHistory.map(trip => (
                  <div key={trip.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bus size={14} className="text-blue-500" />
                        <span className="text-sm font-medium">{trip.bus}</span>
                        <span className="text-sm">{trip.status}</span>
                      </div>
                      <span className="text-xs text-gray-500">{trip.date}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <span className="font-medium bg-blue-100 px-2 py-1 rounded">{trip.from}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium bg-green-100 px-2 py-1 rounded">{trip.to}</span>
                      <span className="ml-auto text-xs text-gray-500">🕐 {trip. time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          {!isEditing && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📊 Statistik Bulan Ini
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-600">Total Trip</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-600">8.5</div>
                  <div className="text-xs text-gray-600">Jam Hemat</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-600">🏆</div>
                  <div className="text-xs text-gray-600">Eco User</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t">
          {isEditing ?  (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Simpan
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Tutup Profil
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UserProfile