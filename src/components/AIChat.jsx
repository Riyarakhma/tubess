import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showQuickButtons, setShowQuickButtons] = useState(true)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Halo! Aku Dipy, AI assistant Bus Dipyo UNDIP!  👋\n\nAku tau semua info tentang:\n🚌 Jadwal & rute bus real-time\n🚏 Info halte dan waktu tiba\n📍 Lokasi bus saat ini\n⏰ Estimasi waktu perjalanan\n\nMau tanya apa nih? 😊", 
      isBot: true,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      mood: "happy"
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiMood, setAiMood] = useState("happy")
  const [conversationContext, setConversationContext] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch real bus data from Supabase
  const fetchBusData = async () => {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('status', 'Aktif')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching buses:', error)
      return []
    }
  }

  // Real UNDIP Bus Data (fallback jika Supabase gagal)
  const busScheduleData = {
    routes: {
      1: {
        name: "Rute Utara",
        color: "Biru",
        haltes: ["Terminal", "FEB", "Teknik", "FSM"],
        schedule: "06:00 - 18:00",
        frequency: "15 menit",
        currentBus: { location: "FEB", eta_next:  "5 menit", passengers: "18/30" }
      },
      2: {
        name: "Rute Selatan", 
        color: "Merah",
        haltes: ["Terminal", "FISIP", "Psikologi", "Hukum"],
        schedule: "06:30 - 17:30", 
        frequency: "20 menit",
        currentBus: { location: "Terminal", eta_next: "8 menit", passengers: "15/30" }
      },
      3: {
        name: "Rute Timur",
        color: "Hijau", 
        haltes: ["Terminal", "FKM", "FIB", "Vokasi"],
        schedule: "07:00 - 17:00",
        frequency: "25 menit", 
        currentBus: { location: "FKM", eta_next: "12 menit", passengers: "12/30" }
      },
      4: {
        name:  "Rute Barat",
        color: "Orange",
        haltes: ["Terminal", "Perikanan", "Kedokteran"],
        schedule: "06:45 - 17:45",
        frequency: "18 menit",
        currentBus: { location: "Perikanan", eta_next: "15 menit", passengers: "22/30" }
      }
    },
    
    halteDetails: {
      "Terminal": {
        fullName: "Terminal Tembalang",
        description: "Gerbang utama kampus UNDIP",
        facilities: ["Tempat duduk", "Atap", "Penerangan", "Security"],
        allRoutes: [1, 2, 3, 4],
        coordinates: "Jl. Prof. Soedarto"
      },
      "FEB": {
        fullName: "Fakultas Ekonomika dan Bisnis", 
        description: "Gedung FEB - Fakultas terbesar untuk ekonomi",
        facilities: ["Shelter", "Kantin terdekat", "Parkiran"],
        routes: [1],
        nextBus: "5 menit (Bus Dipyo 1)"
      },
      "Teknik": {
        fullName: "Fakultas Teknik",
        description: "Kompleks fakultas teknik - terbesar di UNDIP", 
        facilities: ["Shelter besar", "Warung", "ATM terdekat"],
        routes: [1],
        nextBus: "8 menit (Bus Dipyo 1)"
      },
      "FSM": {
        fullName:  "Fakultas Sains dan Matematika",
        description: "Gedung E1 & E2 - Lab komputer 24/7",
        facilities: ["Shelter", "WiFi area", "Vending machine"],
        routes: [1], 
        nextBus: "12 menit (Bus Dipyo 1)"
      },
      "FISIP": {
        fullName: "Fakultas Ilmu Sosial dan Politik", 
        description: "Gedung modern untuk ilmu sosial",
        facilities: ["Shelter", "Taman", "Cafeteria"],
        routes: [2],
        nextBus: "8 menit (Bus Dipyo 2)"
      },
      "Psikologi": {
        fullName: "Fakultas Psikologi",
        description: "Gedung psikologi dengan lab praktek",
        facilities: ["Shelter kecil", "Area hijau", "Parkiran motor"],
        routes: [2],
        nextBus: "15 menit (Bus Dipyo 2)"
      },
      "Hukum": {
        fullName: "Fakultas Hukum", 
        description: "Fakultas tertua di UNDIP - arsitektur klasik",
        facilities: ["Shelter", "Perpustakaan hukum", "Mushola"],
        routes: [2],
        nextBus: "20 menit (Bus Dipyo 2)"
      }
    }
  }

  // Super Smart Response Generator with Supabase integration
  const generateIntelligentResponse = async (input) => {
    const lowerInput = input.toLowerCase()
    
    // Update conversation memory
    setConversationContext(prev => [... prev. slice(-8), input])
    
    // === LIVE STATUS WITH REAL DATA FROM SUPABASE ===
    if (lowerInput.includes('dimana') || lowerInput.includes('posisi') || lowerInput.includes('status') || lowerInput.includes('live') || lowerInput.includes('bus terdekat')) {
      const buses = await fetchBusData()
      
      if (buses.length > 0) {
        const busListText = buses.map(bus => 
          `🚌 **${bus.name}**\n📍 Rute: ${bus.rute}\n⏱️ ETA: ${bus.eta} menit\n👥 Penumpang: ${bus.penumpang}/${bus.capacity}\n📊 Status: ${bus.status}\n`
        ).join('\n')
        
        return {
          response: `📍 **Status Live Bus Dipyo Sekarang (Real-time dari Database):**\n\n${busListText}\n✨ Data diambil langsung dari sistem tracking UNDIP! `,
          mood: "informative"
        }
      } else {
        return {
          response:  "❌ Maaf, belum ada bus yang aktif saat ini atau koneksi ke database bermasalah.  Coba cek lagi nanti ya!  🙏",
          mood: "understanding"
        }
      }
    }

    // === SPECIFIC BUS ROUTE QUESTIONS ===
    if (lowerInput.includes('rute') && lowerInput.includes('1')) {
      const route = busScheduleData.routes[1]
      return {
        response: `🔵 **Rute 1 - ${route.name} (${route.color})**\n\n📍 **Halte yang dilalui:**\n${route. haltes.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n⏰ **Jadwal:** ${route.schedule}\n🔄 **Frekuensi:** Setiap ${route.frequency}\n\n🚌 **Status real-time:**\n📍 Bus sekarang di:  ${route.currentBus.location}\n⏱️ Tiba di halte berikutnya: ${route.currentBus.eta_next}\n👥 Penumpang: ${route.currentBus.passengers}\n\n**Perfect untuk ke FEB, Teknik, atau FSM!** Mau info halte spesifik ga? `,
        mood: "helpful"
      }
    }

    // === HALTE-SPECIFIC INFO ===
    for (const halte of Object.keys(busScheduleData.halteDetails)) {
      if (lowerInput.includes(halte. toLowerCase()) && (lowerInput.includes('halte') || lowerInput.includes('info') || lowerInput.includes('dimana'))) {
        const info = busScheduleData.halteDetails[halte]
        return {
          response: `🚏 **Halte ${info.fullName}**\n\n📍 **Lokasi:** ${info.description}\n\n✨ **Fasilitas:**\n${info.facilities.map(f => `• ${f}`).join('\n')}\n\n🚌 **Bus yang lewat:** Rute ${info.routes ?  info.routes.join(', ') : info.allRoutes.join(', ')}\n\n⏰ **Bus berikutnya:** ${info. nextBus || 'Cek live map untuk update terbaru'}\n\n💡 **Tips:** ${halte === 'Terminal' ? 'Ini starting point semua rute!' : halte === 'FSM' ? 'Lab komputer buka 24/7 loh!' : 'Halte strategis dengan akses mudah! '}`,
          mood: "informative"
        }
      }
    }

    // === BUS TO SPECIFIC FACULTY ===
    if (lowerInput.includes('bus ke') || (lowerInput.includes('ke') && (lowerInput.includes('feb') || lowerInput.includes('fsm') || lowerInput.includes('teknik')))) {
      if (lowerInput.includes('feb')) {
        return {
          response: "📊 **Bus ke FEB (Fakultas Ekonomika & Bisnis)**\n\n🚌 **Naik:** Bus Dipyo 1 (Rute Biru)\n📍 **Dari:** Terminal Tembalang\n⏱️ **Waktu tempuh:** 3-4 menit\n🔄 **Frekuensi:** Setiap 15 menit (06:00-18:00)\n\n📱 **Status real-time:**\n• Bus sedang di area FEB sekarang\n• Bus berikutnya:  5 menit lagi\n• Kapasitas: 18/30 (masih longgar)\n\n💡 **Tips FEB:**\n• Gedung ber-AC, kantin lengkap\n• Dekat dengan area parkir utama\n• Akses mudah ke perpustakaan pusat\n\nLagi mau kuliah atau ada urusan apa di FEB?  😊",
          mood: "helpful"
        }
      }
      
      if (lowerInput.includes('fsm')) {
        return {
          response: "🔬 **Bus ke FSM (Fakultas Sains & Matematika)**\n\n🚌 **Naik:** Bus Dipyo 1 (Rute Biru)\n📍 **Rute:** Terminal → FEB → Teknik → **FSM**\n⏱️ **Waktu tempuh:** 8-10 menit total\n🔄 **Frekuensi:** Setiap 15 menit\n\n📱 **Status real-time:**\n• Bus sekarang di FEB, menuju Teknik\n• ETA ke FSM: 12 menit\n• Kapasitas: 18/30 penumpang\n\n🎓 **Info FSM:**\n• Gedung E1 & E2 (lab komputer, fisika, kimia)\n• Lab komputer buka 24/7!\n• Jurusan:  Informatika, Matematika, Fisika, Kimia, Biologi, Statistika\n\n💻 **Fun fact:** Kalau mau coding atau praktikum, FSM tempatnya! Ada WiFi kenceng dan colokan banyak 😄",
          mood: "excited"
        }
      }

      if (lowerInput.includes('teknik')) {
        return {
          response: "⚙️ **Bus ke Fakultas Teknik**\n\n🚌 **Naik:** Bus Dipyo 1 (Rute Biru)\n📍 **Rute:** Terminal → FEB → **Teknik** → FSM\n⏱️ **Waktu tempuh:** 6-7 menit dari Terminal\n🔄 **Frekuensi:** Setiap 15 menit\n\n📱 **Status real-time:**\n• Bus location: Area FEB sekarang\n• ETA ke Teknik: 8 menit\n• Kondisi: Normal, tidak delay\n\n🏗️ **Info Teknik:**\n• Fakultas TERBESAR di UNDIP!\n• Jurusan: Sipil, Mesin, Elektro, Kimia, Arsitektur, PWK, dll\n• Komplek gedung bertingkat dengan lab canggih\n• Ada kantinnya Bu Sari yang legendaris!  🍜\n\nKamu jurusan apa di Teknik? Atau mau ke lab/workshop tertentu? ",
          mood: "enthusiastic"
        }
      }
    }

    // === JADWAL & WAKTU ===
    if (lowerInput.includes('jadwal') || lowerInput.includes('jam') || lowerInput.includes('schedule')) {
      return {
        response: "⏰ **Jadwal Lengkap Bus Dipyo UNDIP**\n\n🌅 **JADWAL OPERASIONAL:**\n\n🔵 **Rute 1 (Biru)** - FEB→Teknik→FSM\n• Jam: 06:00 - 18:00\n• Frekuensi:  Setiap 15 menit\n• Peak hours: 07:00-09:00, 16:00-18:00\n\n🔴 **Rute 2 (Merah)** - FISIP→Psikologi→Hukum\n• Jam: 06:30 - 17:30\n• Frekuensi: Setiap 20 menit\n\n🟢 **Rute 3 (Hijau)** - FKM→FIB→Vokasi\n• Jam: 07:00 - 17:00\n• Frekuensi: Setiap 25 menit\n\n🟡 **Rute 4 (Orange)** - Perikanan→Kedokteran\n• Jam: 06:45 - 17:45\n• Frekuensi: Setiap 18 menit\n\n📍 **Semua rute START dari Terminal Tembalang**\n\n✨ **GRATIS untuk mahasiswa & dosen UNDIP!**\n\nMau jadwal rute yang mana secara detail? ",
        mood: "informative"
      }
    }

    // === FAKULTAS INFO ===
    if (lowerInput.includes('fakultas') && ! lowerInput.includes('bus')) {
      return {
        response: "🏫 **Fakultas di UNDIP Tembalang:**\n\n📊 **FEB** - Ekonomika & Bisnis (Rute 1)\n• Manajemen, Akuntansi, Ekonomi Pembangunan\n\n⚙️ **Teknik** - Fakultas Terbesar (Rute 1)\n• Sipil, Mesin, Elektro, Kimia, Arsitektur, PWK\n\n🔬 **FSM** - Sains & Matematika (Rute 1)\n• Informatika, Matematika, Fisika, Kimia, Biologi\n\n🏛️ **FISIP** - Sosial & Politik (Rute 2)\n• Administrasi Publik, Hubungan Internasional\n\n🧠 **Psikologi** (Rute 2)\n• Program S1 dan S2 Psikologi\n\n⚖️ **Hukum** - Tertua di UNDIP (Rute 2)\n• Ilmu Hukum S1, S2, S3\n\n🏥 **FKM** - Kesehatan Masyarakat (Rute 3)\n🐟 **Perikanan** & Kelautan (Rute 4)\n⚕️ **Kedokteran** & Kedokteran Gigi (Rute 4)\n\nMau info fakultas yang mana? ",
        mood: "helpful"
      }
    }

    // === REVIEW/RATING PROMPT ===
    if (lowerInput.includes('review') || lowerInput.includes('rating') || lowerInput.includes('bintang') || lowerInput.includes('kasih nilai')) {
      return {
        response: "⭐ **Review & Rating Bus Dipyo**\n\nWah, mau kasih review ya?  Itu sangat membantu! 🙏\n\n📝 **Cara kasih review:**\n1. Klik tab **⭐ Review & Rating** di atas\n2. Pilih bus yang mau di-review\n3. Kasih bintang 1-5 ⭐\n4. Tulis pengalaman kamu\n5. Submit!\n\n💡 **Review kamu akan membantu:**\n• Mahasiswa lain tahu kualitas service\n• Tim Bus Dipyo improve layanan\n• Rekomendasi rute terbaik\n\nYuk kasih review sekarang! 🚀",
        mood: "encouraging"
      }
    }

    // === CASUAL CONVERSATION ===
    if (lowerInput.includes('halo') || lowerInput.includes('hai') || lowerInput.includes('hi')) {
      const greetings = [
        "Halo! 👋 Senang ketemu kamu!  Ada yang bisa aku bantu soal Bus Dipyo hari ini?  Atau mau ngobrol santai aja juga boleh! 😊",
        "Hai hai! ✨ Gimana kabarnya?  Lagi butuh info transportasi kampus atau just want to chat?  Aku siap!  🚌",
        "Hello there! 🌟 Aku Dipy, ready to help!  Mau tanya soal jadwal bus, rute, atau hal lain? All ears!"
      ]
      return {
        response: greetings[Math.floor(Math.random() * greetings.length)],
        mood: "friendly"
      }
    }

    // === WEATHER & TRANSPORTATION ===
    if (lowerInput.includes('hujan') || lowerInput.includes('panas') || lowerInput.includes('cuaca')) {
      return {
        response: "🌤️ Oh iya, cuaca Semarang emang unpredictable!\n\nMakanya Bus Dipyo itu lifesaver banget:\n\n☔ **Kalau hujan:**\n• Tetap kering dan nyaman\n• Ga perlu bawa jas hujan ribet\n• Schedule tetap jalan (kecuali hujan extreme)\n\n☀️ **Kalau panas:**\n• AC dingin di dalam bus\n• Ga kepanasan kayak naik motor\n• Bisa rileks sambil lihat pemandangan\n\n💡 **Pro tip:** Cek weather forecast di pagi hari, kalau looks like bakal hujan, better naik Bus Dipyo daripada motor!\n\nLagi planning perjalanan ya karena cuaca?  Mau ke fakultas mana?  🚌",
        mood: "understanding"
      }
    }

    // === RANDOM/GENERAL CONVERSATION ===
    const naturalResponses = [
      `Interesting! "${input}" ya? 🤔\n\nAku belum pernah diajak ngobrol tentang ini sebelumnya!  Tell me more - ada cerita khusus di balik topik ini?\n\nBtw, kalau ada yang mau ditanyain soal Bus Dipyo juga, just let me know ya!  Aku happy to chat about anything! 😊`,
      
      `Oh "${input}"! 💭\n\nSounds intriguing!  Kamu kenapa tiba-tiba kepikiran ini? Ada experience atau maybe something you're curious about?\n\nAku suka banget dengerin different perspectives.  Share more dong!  And if you need any bus info along the way, aku siap!  🚌✨`,
      
      `"${input}" nih! That's quite a topic! 🌟\n\nAku curious - what got you thinking about this? Personal experience kah atau lagi research something?\n\nFeel free to elaborate! Dan kapan aja butuh info transportasi UNDIP, tinggal bilang aja ya! 😄`
    ]

    return {
      response: naturalResponses[Math.floor(Math.random() * naturalResponses. length)],
      mood: "curious"
    }
  }

  const getAiAvatar = (mood) => {
    switch(mood) {
      case "happy":  case "friendly": return "😊"
      case "excited": case "enthusiastic": return "🤩"
      case "helpful": case "informative": return "🤓"
      case "thinking": return "🤔"
      case "caring": case "understanding": return "🥰"
      case "curious": return "🧐"
      case "encouraging": return "🌟"
      default: return "😊"
    }
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const newTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: inputText, 
      isBot: false, 
      time:  newTime 
    }])

    setIsTyping(true)
    setAiMood("thinking")
    
    const delay = Math.min(Math.max(inputText.length * 35 + Math.random() * 1000, 800), 2500)
    
    setTimeout(async () => {
      setIsTyping(false)
      const { response, mood } = await generateIntelligentResponse(inputText)
      setAiMood(mood)
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response, 
        isBot: true, 
        time:  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        mood:  mood
      }])
    }, delay)

    setInputText('')
    setShowQuickButtons(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickButton = (query) => {
    setInputText(query)
    inputRef.current?.focus()
  }

  const toggleQuickButtons = () => {
    setShowQuickButtons(!showQuickButtons)
  }

  const minimizeChat = () => {
    setIsMinimized(! isMinimized)
  }

  const quickButtons = [
    { text: "🚌 Bus ke FEB", query: "bus ke feb" },
    { text: "🔬 Bus ke FSM", query: "bus ke fsm" },  
    { text: "⏰ Jadwal semua rute", query: "jadwal bus undip" },
    { text:  "📍 Status bus live", query: "posisi bus sekarang dimana" },
    { text:  "🚏 Info halte", query: "info halte terminal" },
    { text: "⭐ Kasih review", query: "mau kasih review bus" }
  ]

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6" style={{ zIndex: 9997 }}>
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl relative overflow-hidden group transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl relative z-10">🤖</span>
            <div className="absolute -top-2 -right-2 text-yellow-300 animate-bounce">✨</div>
            <div className="absolute -bottom-1 -left-1 text-pink-300 animate-pulse">💖</div>
          </button>
          
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
            AI
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 w-80 bg-white rounded-3xl shadow-2xl border-4 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[32rem]'
          }`}
          style={{ 
            zIndex: 9998,
            borderImage: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) 1"
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg animate-pulse">
                  {getAiAvatar(aiMood)}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Dipy - Bus AI</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90">Bus Expert Mode 🚌</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleQuickButtons} 
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  title={showQuickButtons ? "Sembunyikan menu cepat" : "Tampilkan menu cepat"}
                >
                  <span className="text-sm">{showQuickButtons ? '▼' : '▲'}</span>
                </button>
                <button 
                  onClick={minimizeChat} 
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  title={isMinimized ? "Buka chat" : "Minimize chat"}
                >
                  <span className="text-sm">{isMinimized ? '🔼' : '🔽'}</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover: bg-white/20 p-2 rounded-full transition-colors"
                  title="Tutup chat"
                >✕</button>
              </div>
            </div>
          </div>

          {! isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-blue-50/50 to-indigo-50/30">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] ${msg.isBot ?  'order-2' : ''}`}>
                      {msg.isBot && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-lg">
                            {getAiAvatar(msg.mood || "happy")}
                          </div>
                          <span className="text-sm text-indigo-600 font-bold">Dipy</span>
                          <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                      )}
                      <div className={`p-4 rounded-2xl shadow-lg transition-all hover:scale-105 ${
                        msg.isBot 
                          ?  'bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-100 text-gray-800' 
                          :  'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>
                      </div>
                      {! msg.isBot && (
                        <div className="text-right mt-1">
                          <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-100 p-4 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{getAiAvatar("thinking")}</div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-indigo-600 font-medium">analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Buttons */}
              {showQuickButtons && (
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
                  <div className="grid grid-cols-2 gap-2">
                    {quickButtons.map((btn, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickButton(btn.query)}
                        className="text-xs bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 hover:border-indigo-300 px-2 py-2 rounded-lg transition-all duration-200 text-left shadow-sm hover:shadow-md hover:scale-105"
                      >
                        <div className="font-medium text-indigo-700">{btn.text}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t border-indigo-100">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Tanya soal bus, rute, jadwal...  🚌✨"
                      className="w-full border-2 border-indigo-200 focus:border-indigo-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                  >
                    <span className="relative z-10">➤</span>
                  </button>
                </div>
                
                {! showQuickButtons && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={toggleQuickButtons}
                      className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full"
                    >
                      ⚡ Quick Actions
                    </button>
                  </div>
                )}
                
                <div className="text-center mt-2">
                  <p className="text-xs text-indigo-500">
                    🚌 UNDIP Transportation AI • Real-time Info! 
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AIChat