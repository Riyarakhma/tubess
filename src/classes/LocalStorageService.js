// Child Class - LocalStorageService (untuk Offline Mode)
import { DatabaseService } from './DatabaseService.js';
import { DataRetrievalError, DataInsertionError } from './Exceptions.js';

export class LocalStorageService extends DatabaseService {
  constructor() {
    super();
    this.prefix = 'bustrack_'; // Prefix untuk avoid collision
    this.connected = true; // LocalStorage always available
  }
  
  // Override method connect
  async connect() {
    try {
      // Test localStorage availability
      const testKey = `${this.prefix}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      this.log('LocalStorage ready', 'success');
      return { success: true, message: "LocalStorage ready" };
    } catch (error) {
      this.log('LocalStorage not available', 'error');
      throw new Error('LocalStorage is not available');
    }
  }
  
  // Override method getData
  async getData(key) {
    try {
      const fullKey = `${this.prefix}${key}`;
      const data = localStorage.getItem(fullKey);
      
      if (!data) {
        this.log(`No data found for key: ${key}`, 'warn');
        return null;
      }
      
      const parsed = JSON.parse(data);
      this.log(`Retrieved data for key: ${key}`, 'info');
      return parsed;
    } catch (error) {
      this.log(`Failed to get data for ${key}: ${error.message}`, 'error');
      throw new DataRetrievalError(`Failed to retrieve data: ${error.message}`);
    }
  }
  
  // Override method insertData (sama dengan update untuk localStorage)
  async insertData(key, data) {
    return this.updateData(key, null, data);
  }
  
  // Override method updateData
  async updateData(key, id, data) {
    try {
      const fullKey = `${this.prefix}${key}`;
      const jsonData = JSON.stringify(data);
      
      // Check quota
      const size = new Blob([jsonData]).size;
      if (size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Data too large for localStorage (max 5MB)');
      }
      
      localStorage.setItem(fullKey, jsonData);
      this.log(`Saved data for key: ${key}`, 'success');
      return { success: true, data };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.log('LocalStorage quota exceeded', 'error');
        throw new DataInsertionError('Storage quota exceeded');
      }
      
      this.log(`Failed to save data for ${key}: ${error.message}`, 'error');
      throw new DataInsertionError(`Failed to save data: ${error.message}`);
    }
  }
  
  // Override method deleteData
  async deleteData(key) {
    try {
      const fullKey = `${this.prefix}${key}`;
      localStorage.removeItem(fullKey);
      this.log(`Deleted data for key: ${key}`, 'success');
      return { success: true };
    } catch (error) {
      this.log(`Failed to delete ${key}: ${error.message}`, 'error');
      throw new DataInsertionError(`Failed to delete data: ${error.message}`);
    }
  }
  
  // Method untuk get semua keys
  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }
  
  // Method untuk clear semua data app
  clearAll() {
    const keys = this.getAllKeys();
    keys.forEach(key => {
      localStorage.removeItem(`${this.prefix}${key}`);
    });
    this.log('Cleared all app data from localStorage', 'info');
    return { success: true, cleared: keys.length };
  }
  
  // Method untuk get storage usage
  getStorageInfo() {
    let totalSize = 0;
    const items = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        
        items.push({
          key: key.replace(this.prefix, ''),
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        });
      }
    }
    
    return {
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      itemCount: items.length,
      items
    };
  }
  
  // Method khusus untuk favorites
  async getFavorites() {
    return this.getData('favorites') || [];
  }
  
  async saveFavorites(favorites) {
    return this.insertData('favorites', favorites);
  }
  
  async addFavorite(halteId) {
    const favorites = await this.getFavorites();
    if (!favorites.includes(halteId)) {
      favorites.push(halteId);
      await this.saveFavorites(favorites);
    }
    return favorites;
  }
  
  async removeFavorite(halteId) {
    const favorites = await this.getFavorites();
    const filtered = favorites.filter(id => id !== halteId);
    await this.saveFavorites(filtered);
    return filtered;
  }
  
  // Method untuk cache data dari Supabase
  async cacheData(key, data, expiryMinutes = 60) {
    const cacheData = {
      data,
      timestamp: new Date().getTime(),
      expiryMinutes
    };
    return this.insertData(`cache_${key}`, cacheData);
  }
  
  // Method untuk get cached data
  async getCachedData(key) {
    const cached = await this.getData(`cache_${key}`);
    
    if (!cached) return null;
    
    const now = new Date().getTime();
    const age = (now - cached.timestamp) / (1000 * 60); // minutes
    
    if (age > cached.expiryMinutes) {
      this.log(`Cache expired for ${key}`, 'warn');
      await this.deleteData(`cache_${key}`);
      return null;
    }
    
    this.log(`Retrieved cached data for ${key}`, 'info');
    return cached.data;
  }
}