// Parent Class - DatabaseService (untuk Polymorphism)
// Abstract class yang harus di-implement oleh child classes

export class DatabaseService {
  constructor() {
    if (new.target === DatabaseService) {
      throw new TypeError("Cannot construct DatabaseService instances directly");
    }
  }
  
  // Abstract method - harus di-implement di child class
  async connect() {
    throw new Error("Method 'connect()' must be implemented");
  }
  
  // Abstract method - harus di-implement di child class
  async getData(table) {
    throw new Error("Method 'getData()' must be implemented");
  }
  
  // Abstract method - harus di-implement di child class
  async insertData(table, data) {
    throw new Error("Method 'insertData()' must be implemented");
  }
  
  // Abstract method - harus di-implement di child class
  async updateData(table, id, data) {
    throw new Error("Method 'updateData()' must be implemented");
  }
  
  // Abstract method - harus di-implement di child class
  async deleteData(table, id) {
    throw new Error("Method 'deleteData()' must be implemented");
  }
  
  // Shared method yang bisa dipakai semua child class
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }
  
  // Shared method untuk validasi data
  validateData(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }
}