import React, { useState } from 'react'

export default function ReviewPage() {
  const [formData, setFormData] = useState({
    busId: '',
    rating: 5,
    comment: '',
    userName: ''  // ← Kosong, wajib diisi
  })

  const [reviews, setReviews] = useState([
    {
      id: 1,
      user_name: 'Budi Mahasiswa',
      rating: 5,
      comment:  'Bus Dipyo mantap!    AC dingin, sopir ramah.    Ga telat lagi ke kelas! ',
      created_at: '2025-01-15T08:30:00',
      buses: { name: 'Bus Dipyo 1' }
    },
    {
      id: 2,
      user_name: 'Siti Anggun',
      rating: 4,
      comment: 'Lumayan oke, cuma kadang lama nunggu di halte.   Overall bagus sih! ',
      created_at: '2025-01-14T14:20:00',
      buses: { name: 'Bus Dipyo 2' }
    }
  ])

  const buses = [
    { id: 1, name: 'Bus Dipyo 1', rute: 'Terminal → FEB → Teknik → FSM' },
    { id: 2, name: 'Bus Dipyo 2', rute: 'Terminal → FISIP → Psikologi → Hukum' },
    { id: 3, name: 'Bus Dipyo 3', rute: 'Terminal → FKM → FIB → Vokasi' },
    { id: 4, name: 'Bus Dipyo 4', rute: 'Terminal → Perikanan → Kedokteran' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validasi nama wajib
    if (!formData.userName.trim()) {
      alert('⚠️ Nama wajib diisi!')
      return
    }
    
    // Validasi bus
    if (!formData.busId) {
      alert('⚠️ Pilih bus dulu!')
      return
    }
    
    // Validasi komentar
    if (!formData.comment.trim()) {
      alert('⚠️ Tulis komentar dulu!')
      return
    }

    const selectedBus = buses.find(b => b.id == formData.busId)
    
    const newReview = {
      id: reviews.length + 1,
      user_name: formData.userName,
      rating: formData.rating,
      comment: formData.comment,
      created_at: new Date().toISOString(),
      buses: { name: selectedBus.name }
    }
    
    setReviews([newReview, ...reviews])
    alert('✅ Review berhasil dikirim!')
    setFormData({ busId: '', rating: 5, comment: '', userName: '' })
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form Review */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          ⭐ Berikan Review & Rating
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama WAJIB */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Kamu *
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama kamu"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nama akan ditampilkan di review kamu
            </p>
          </div>

          {/* Pilih Bus */}
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Bus *</label>
            <select
              value={formData.busId}
              onChange={(e) => setFormData({...formData, busId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Pilih Bus --</option>
              {buses. map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} - {bus.rute}
                </option>
              ))}
            </select>
            <p className="text-xs text-green-600 mt-1 font-medium">
              ✅ {buses.length} bus tersedia
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= formData.rating ? '⭐' : '☆'}
                </button>
              ))}
              <span className="text-gray-600 ml-2 self-center font-medium">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Komentar */}
          <div>
            <label className="block text-sm font-medium mb-2">Komentar *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e. target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus: ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Tulis pengalaman kamu naik Bus Dipyo..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
          >
            📤 Kirim Review
          </button>
        </form>
      </div>

      {/* List Reviews */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          💬 Review dari Mahasiswa ({reviews.length})
        </h2>
        
        {reviews.map(review => (
          <div key={review.id} className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {review.user_name[0]. toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{review.user_name}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month:  'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-xl">{renderStars(review.rating)}</div>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                🚌 {review.buses.name}
              </span>
            </div>

            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}