// Child Class - Bus (Inheritance dari Vehicle)
import { Vehicle } from './Vehicle.js';
import { ValidationError } from './Exceptions.js';

export class Bus extends Vehicle {
  constructor(id, lat, lng, status, routeId, capacity, currentPassengers) {
    super(id, lat, lng, status);
    this.routeId = routeId;
    this.capacity = capacity;
    this.currentPassengers = currentPassengers;
    this.history = []; // Track movement history
  }
  
  // Override method dari parent (Polymorphism)
  getInfo() {
    return `Bus ${this.id} - Route ${this.routeId} - ${this.currentPassengers}/${this.capacity} passengers`;
  }
  
  // Method untuk update jumlah penumpang
  updatePassengers(count) {
    if (count < 0 || count > this.capacity) {
      throw new ValidationError(`Invalid passenger count: ${count}`);
    }
    this.currentPassengers = count;
  }
  
  // Method untuk get crowd level
  getCrowdLevel() {
    const percentage = (this.currentPassengers / this.capacity) * 100;
    
    if (percentage >= 80) {
      return { level: "Penuh", color: "#ef4444", percentage: Math.round(percentage) };
    }
    if (percentage >= 50) {
      return { level: "Sedang", color: "#f59e0b", percentage: Math.round(percentage) };
    }
    return { level: "Kosong", color: "#10b981", percentage: Math.round(percentage) };
  }
  
  // Method untuk kalkulasi ETA ke halte
  calculateETA(halte) {
    const distance = this.calculateDistance(
      this.lat, 
      this.lng, 
      halte.lat, 
      halte.lng
    );
    
    // Asumsi kecepatan rata-rata 30 km/jam
    const avgSpeed = 30; // km/h
    const timeInHours = distance / avgSpeed;
    const timeInMinutes = timeInHours * 60;
    
    return Math.round(timeInMinutes);
  }
  
  // Method untuk check apakah bus penuh
  isFull() {
    return this.currentPassengers >= this.capacity;
  }
  
  // Method untuk add passenger
  addPassenger() {
    if (this.isFull()) {
      throw new ValidationError("Bus is full");
    }
    this.currentPassengers++;
  }
  
  // Method untuk remove passenger
  removePassenger() {
    if (this.currentPassengers <= 0) {
      throw new ValidationError("No passengers to remove");
    }
    this.currentPassengers--;
  }
  
  // Override updatePosition untuk track history
  updatePosition(lat, lng) {
    if (!this.isValidCoordinate(lat, lng)) {
      throw new ValidationError(`Invalid coordinates: (${lat}, ${lng})`);
    }
    
    // Save to history
    this.history.push({
      lat: this.lat,
      lng: this.lng,
      timestamp: new Date()
    });
    
    // Keep only last 50 positions
    if (this.history.length > 50) {
      this.history.shift();
    }
    
    // Call parent method
    super.updatePosition(lat, lng);
  }
  
  // Method untuk get average speed
  getAverageSpeed() {
    if (this.history.length < 2) return 0;
    
    const recentHistory = this.history.slice(-10);
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < recentHistory.length; i++) {
      const prev = recentHistory[i - 1];
      const curr = recentHistory[i];
      
      const distance = this.calculateDistance(
        prev.lat, prev.lng,
        curr.lat, curr.lng
      );
      
      const timeDiff = (curr.timestamp - prev.timestamp) / (1000 * 60 * 60); // hours
      
      totalDistance += distance;
      totalTime += timeDiff;
    }
    
    return totalTime > 0 ? totalDistance / totalTime : 0;
  }
  
  // Method untuk export data bus ke JSON
  toJSON() {
    return {
      id: this.id,
      routeId: this.routeId,
      lat: this.lat,
      lng: this.lng,
      status: this.status,
      capacity: this.capacity,
      currentPassengers: this.currentPassengers,
      crowdLevel: this.getCrowdLevel(),
      lastUpdated: this.lastUpdated,
      averageSpeed: this.getAverageSpeed()
    };
  }
}