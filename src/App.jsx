import React, { useState, useEffect } from 'react';
import { AlertCircle, Star, MapPin } from 'lucide-react';

// Import OOP Classes
import { Bus } from './classes/Bus.js';
import { SupabaseService } from './classes/SupabaseService.js';
import { LocalStorageService } from './classes/LocalStorageService.js';

// Import Components
import Header from './components/Header.jsx';
import Notifications from './components/Notifications.jsx';
import RouteFilter from './components/RouteFilter.jsx';
import TabNavigation from './components/TabNavigation.jsx';
import MapView from './components/MapView.jsx';
import BusList from './components/BusList.jsx';
import HalteList from './components/HalteList.jsx';

function App() {
  // State Management
  const [routes, setRoutes] = useState([]);
  const [haltes, setHaltes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('map');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Database Services (OOP)
  const [supabaseService] = useState(() => new SupabaseService());
  const [localStorageService] = useState(() => new LocalStorageService());
  const [realtimeChannel, setRealtimeChannel] = useState(null);

  // Initialize App
  useEffect(() => {
    initializeApp();
    setupOnlineListener();

    return () => {
      // Cleanup
      if (realtimeChannel) {
        supabaseService.unsubscribe(realtimeChannel);
      }
    };
  }, []);

  // Setup real-time bus position updates
  useEffect(() => {
    if (buses.length > 0) {
      const interval = setInterval(() => {
        simulateBusMovement();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [buses]);

  // Check for nearby buses to favorites
  useEffect(() => {
    if (buses.length > 0 && favorites?.length > 0) {
      checkNearbyBuses();
    }
  }, [buses, favorites]);

  const initializeApp = async () => {
    try {
      setLoading(true);

      await supabaseService.connect();
      await localStorageService.connect();

      const [routesData, haltesData, busesData] = await Promise.all([
        supabaseService.getData('routes'),
        supabaseService.getData('haltes'),
        supabaseService.getData('buses')
      ]);

      setRoutes(routesData);
      setHaltes(haltesData);

      // Convert bus data into Bus OOP objects
      const busObjects = busesData.map(b =>
        new Bus(
          b.id,
          b.lat,
          b.lng,
          b.status,
          b.route_id,
          b.capacity,
          b.current_passengers
        )
      );
      setBuses(busObjects);

      // FIX: fallback array
      const savedFavorites = (await localStorageService.getFavorites()) || [];
      setFavorites(savedFavorites);

      // Enable realtime
      setupRealtimeSubscription();

      // Cache for offline use
      await localStorageService.cacheData('routes', routesData);
      await localStorageService.cacheData('haltes', haltesData);

      addNotification('✅ Aplikasi siap digunakan!', 'success');
    } catch (error) {
      console.error('Initialization error:', error);
      setError(error.message);
      addNotification(`❌ Error: ${error.message}`, 'error');

      await loadFromCache();
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    try {
      const channel = supabaseService.subscribeToTable('buses', (payload) => {
        handleRealtimeUpdate(payload);
      });
      setRealtimeChannel(channel);
    } catch (error) {
      console.error('Realtime subscription error:', error);
    }
  };

  const handleRealtimeUpdate = (payload) => {
    if (payload.eventType === 'UPDATE') {
      const updatedBus = payload.new;

      setBuses(prev =>
        prev.map(bus => {
          if (bus.id === updatedBus.id) {
            bus.updatePosition(updatedBus.lat, updatedBus.lng);
            bus.updatePassengers(updatedBus.current_passengers);
          }
          return bus;
        })
      );
    }
  };

  const loadFromCache = async () => {
    try {
      const cachedRoutes = await localStorageService.getCachedData('routes');
      const cachedHaltes = await localStorageService.getCachedData('haltes');

      if (cachedRoutes) setRoutes(cachedRoutes);
      if (cachedHaltes) setHaltes(cachedHaltes);

      if (cachedRoutes || cachedHaltes) {
        addNotification('📦 Data dimuat dari cache (offline mode)', 'info');
      }
    } catch (error) {
      console.error('Cache loading error:', error);
    }
  };

  const setupOnlineListener = () => {
    window.addEventListener('online', () => {
      setIsOnline(true);
      addNotification('🌐 Kembali online!', 'success');
      initializeApp();
    });

    window.addEventListener('offline', () => {
      setIsOnline(false);
      addNotification('📴 Mode offline - data mungkin tidak up-to-date', 'warning');
    });
  };

  const simulateBusMovement = () => {
    setBuses(prevBuses =>
      prevBuses.map(bus => {
        try {
          const deltaLat = (Math.random() - 0.5) * 0.0005;
          const deltaLng = (Math.random() - 0.5) * 0.0005;

          bus.updatePosition(bus.lat + deltaLat, bus.lng + deltaLng);

          if (Math.random() > 0.9) {
            const change = Math.floor(Math.random() * 3) - 1;
            const newCount = Math.max(0, Math.min(bus.capacity, bus.currentPassengers + change));
            bus.updatePassengers(newCount);
          }
        } catch (error) {
          console.error('Bus movement error:', error);
        }

        return bus;
      })
    );
  };

  const checkNearbyBuses = () => {
    favorites?.forEach(favId => {
      const halte = haltes.find(h => h.id === favId);
      if (!halte) return;

      buses.forEach(bus => {
        try {
          const eta = bus.calculateETA(halte);

          if (eta === 2 || eta === 3) {
            const route = routes.find(r => r.id === bus.routeId);
            addNotification(
              `🚌 Bus ${bus.id} (${route?.name}) akan tiba di ${halte.name} dalam ${eta} menit!`,
              'warning'
            );
          }
        } catch (error) {
          console.error('ETA calculation error:', error);
        }
      });
    });
  };

  const addNotification = (message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 5));

    setTimeout(() => {
      removeNotification(newNotif.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleFavorite = async (halteId) => {
    try {
      let newFavorites;

      if (favorites.includes(halteId)) {
        newFavorites = await localStorageService.removeFavorite(halteId);
        addNotification('🗑️ Dihapus dari favorit', 'success');
      } else {
        newFavorites = await localStorageService.addFavorite(halteId);
        addNotification('⭐ Ditambah ke favorit', 'success');
      }

      // FIX SAFE UPDATE
      setFavorites(newFavorites || []);
    } catch (error) {
      addNotification(`❌ Error: ${error.message}`, 'error');
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isOnline={isOnline} />

      <Notifications 
        notifications={notifications} 
        onClose={removeNotification}
      />

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <RouteFilter
        routes={routes}
        selectedRoute={selectedRoute}
        onSelectRoute={setSelectedRoute}
      />

      <TabNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'map' && (
          <MapView
            buses={buses}
            haltes={haltes}
            routes={routes}
            selectedRoute={selectedRoute}
          />
        )}

        {activeTab === 'haltes' && (
          <HalteList
            haltes={haltes}
            buses={buses}
            routes={routes}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            selectedRoute={selectedRoute}
          />
        )}

        {activeTab === 'buses' && (
          <BusList
            buses={buses}
            routes={routes}
            selectedRoute={selectedRoute}
          />
        )}

        {activeTab === 'favorites' && (
          <div>
            {favorites?.length > 0 ? (
              <HalteList
                haltes={haltes.filter(h => favorites.includes(h.id))}
                buses={buses}
                routes={routes}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                selectedRoute={null}
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Star size={48} className="mx-auto text-gray-400 mb3" />
                <p className="text-gray-600 mb-2">Belum ada halte favorit</p>
                <p className="text-sm text-gray-500">
                  Tap ikon ⭐ di halte untuk menambahkan ke favorit
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 right-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Install sebagai PWA untuk notifikasi real-time & offline mode!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;