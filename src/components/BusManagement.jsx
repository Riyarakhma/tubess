import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function BusManagement() {
  const [buses, setBuses] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    rute: '',
    capacity: 30,
    penumpang: 0,
    eta: 0,
    status: 'Aktif',
    color: '#3B82F6'
  })

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    const { data } = await supabase.from('buses').select('*').order('created_at', { ascending: false })
    setBuses(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEditing) {
      // Update
      const { error } = await supabase
        .from('buses')
        .update(formData)
        .eq('id', editId)
      
      if (!error) {
        alert('✅ Bus berhasil diupdate!')
        resetForm()
        fetchBuses()
      } else {
        alert('❌ Gagal update:  ' + error.message)
      }
    } else {
      // Insert
      const { error } = await supabase.from('buses').insert([formData])
      
      if (!error) {
        alert('✅ Bus berhasil ditambahkan!')
        resetForm()
        fetchBuses()
      } else {
        alert('❌ Gagal tambah bus: ' + error.message)
      }
    }
  }

  const handleEdit = (bus) => {
    setIsEditing(true)
    setEditId(bus. id)
    setFormData({
      name: bus.name,
      rute: bus.rute,
      capacity: bus. capacity,
      penumpang:  bus.penumpang,
      eta: bus.eta,
      status: bus.status,
      color: bus.color
    })
  }

  const handleDelete = async (id) => {
    if (! confirm('Yakin hapus bus ini?')) return

    const { error } = await supabase. from('buses').delete().eq('id', id)
    
    if (!error) {
      alert('✅ Bus berhasil dihapus!')
      fetchBuses()
    } else {
      alert('❌ Gagal hapus:  ' + error.message)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setFormData({
      name:  '',
      rute: '',
      capacity: 30,
      penumpang: 0,
      eta: 0,
      status: 'Aktif',
      color: '#3B82F6'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Form */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {isEditing ? '✏️ Edit Bus' : '➕ Tambah Bus Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md: grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Bus *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target. value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Bus Dipyo 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rute *</label>
            <input
              type="text"
              value={formData.rute}
              onChange={(e) => setFormData({...formData, rute: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Terminal → FEB → Teknik"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kapasitas</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus: ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Penumpang Saat Ini</label>
            <input
              type="number"
              value={formData.penumpang}
              onChange={(e) => setFormData({...formData, penumpang: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus: ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ETA (menit)</label>
            <input
              type="number"
              value={formData.eta}
              onChange={(e) => setFormData({...formData, eta: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e. target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus: ring-2 focus:ring-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Delay">Delay</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Warna (Hex)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
            >
              {isEditing ? '💾 Update Bus' : '➕ Tambah Bus'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-medium"
              >
                ❌ Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Buses */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🚌 Daftar Bus ({buses.length})
        </h2>

        {buses.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow text-center text-gray-500">
            Belum ada bus. Tambahkan bus pertama! 🚀
          </div>
        ) : (
          <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
            {buses. map(bus => (
              <div
                key={bus.id}
                className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow hover: shadow-lg transition border-l-4"
                style={{ borderLeftColor: bus.color }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{bus. name}</h3>
                    <p className="text-sm text-gray-600">{bus.rute}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bus. status === 'Aktif' ? 'bg-green-100 text-green-700' : 
                      bus.status === 'Delay' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Kapasitas</div>
                    <div className="font-bold">{bus.capacity}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Penumpang</div>
                    <div className="font-bold">{bus.penumpang}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">ETA</div>
                    <div className="font-bold">{bus. eta} min</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}