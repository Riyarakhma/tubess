export class Vehicle {
  constructor(id, lat, lng, status) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.lastUpdated = new Date();
  }
  
  updatePosition(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.lastUpdated = new Date();
  }
  
  // Method untuk get info (akan di-override di child class)
  getInfo() {
    return `Vehicle ${this.id} at (${this.lat}, ${this.lng})`;
  }
  
  // Method untuk validasi koordinat
  isValidCoordinate(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }
  
  // Method untuk hitung jarak (Haversine Formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * 
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
  
  // Helper method
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Method untuk check apakah vehicle aktif
  isActive() {
    return this.status === 'active';
  }
}