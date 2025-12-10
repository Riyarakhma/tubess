class BusSystemException extends Error {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.timestamp = new Date().toISOString()
  }
}

class BusNotFoundException extends BusSystemException {
  constructor(busId) {
    super(`Bus dengan ID ${busId} tidak ditemukan`, 'BUS_NOT_FOUND')
    this.busId = busId
  }
}

class BusFullException extends BusSystemException {
  constructor(busName, capacity) {
    super(`${busName} sudah penuh! Kapasitas: ${capacity}/30`, 'BUS_FULL')
    this.busName = busName
    this.capacity = capacity
  }
}

class InvalidRouteException extends BusSystemException {
  constructor(routeId) {
    super(`Rute ${routeId} tidak valid`, 'INVALID_ROUTE')
    this.routeId = routeId
  }
}

class HalteNotFoundException extends BusSystemException {
  constructor(halteName) {
    super(`Halte ${halteName} tidak ditemukan`, 'HALTE_NOT_FOUND')
    this.halteName = halteName
  }
}

// Base class untuk semua entitas transportasi
class TransportEntity {
  constructor(id, name, location) {
    if (this.constructor === TransportEntity) {
      throw new Error("Cannot instantiate abstract class TransportEntity")
    }
    this.id = id
    this.name = name
    this.location = location
    this.createdAt = new Date()
  }

  // Abstract method - harus di-override
  getInfo() {
    throw new Error("Method getInfo() must be implemented")
  }

  // Common method untuk semua transport entity
  getAge() {
    const now = new Date()
    const diff = now - this.createdAt
    return Math.floor(diff / 1000) // seconds
  }

  updateLocation(lat, lng) {
    this.location = { lat, lng }
    console.log(`${this.name} lokasi updated: (${lat}, ${lng})`)
  }
}

class Bus extends TransportEntity {
  constructor(id, name, rute, lat, lng) {
    super(id, name, { lat, lng })
    this.rute = rute
    this.penumpang = 0
    this.capacity = 30
    this.status = 'Aktif'
    this.speed = 0
    this.eta = 0
  }

  // Polymorphism - Override getInfo()
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: 'Bus',
      rute: this.rute,
      location: this.location,
      penumpang: `${this.penumpang}/${this.capacity}`,
      status: this.status,
      speed: `${this.speed} km/h`,
      eta: `${this.eta} menit`
    }
  }

  // Bus-specific methods
  addPassenger(count = 1) {
    if (this.penumpang + count > this.capacity) {
      throw new BusFullException(this.name, this.penumpang + count)
    }
    this.penumpang += count
    console.log(`✅ ${count} penumpang naik. Total: ${this.penumpang}/${this.capacity}`)
    return this.penumpang
  }

  removePassenger(count = 1) {
    if (this.penumpang - count < 0) {
      throw new BusSystemException(
        `Tidak bisa turunkan ${count} penumpang. Hanya ada ${this.penumpang}`,
        'INVALID_PASSENGER_COUNT'
      )
    }
    this.penumpang -= count
    console.log(`👋 ${count} penumpang turun. Sisa: ${this.penumpang}/${this.capacity}`)
    return this.penumpang
  }

  setSpeed(speed) {
    if (speed < 0 || speed > 60) {
      throw new BusSystemException(
        `Kecepatan tidak valid: ${speed} km/h (harus 0-60)`,
        'INVALID_SPEED'
      )
    }
    this.speed = speed
  }

  setStatus(status) {
    const validStatuses = ['Aktif', 'Delay', 'Maintenance', 'Inactive']
    if (!validStatuses.includes(status)) {
      throw new BusSystemException(
        `Status tidak valid: ${status}`,
        'INVALID_STATUS'
      )
    }
    this.status = status
  }

  calculateETA(distance) {
    if (this.speed === 0) return Infinity
    return Math.round((distance / this.speed) * 60) // dalam menit
  }

  isFull() {
    return this.penumpang >= this.capacity
  }

  getOccupancyRate() {
    return Math.round((this.penumpang / this.capacity) * 100)
  }
}


// Specialized Bus Types (Inheritance)
class ElectricBus extends Bus {
  constructor(id, name, rute, lat, lng, batteryLevel = 100) {
    super(id, name, rute, lat, lng)
    this.batteryLevel = batteryLevel
    this.type = 'Electric'
  }

  getInfo() {
    const baseInfo = super.getInfo()
    return {
      ...baseInfo,
      type: 'Electric Bus',
      battery: `${this.batteryLevel}%`,
      ecoFriendly: true
    }
  }

  charge(amount) {
    this.batteryLevel = Math.min(100, this.batteryLevel + amount)
    console.log(`🔋 Charging... Battery: ${this.batteryLevel}%`)
  }

  needsCharging() {
    return this.batteryLevel < 20
  }
}


class ACBus extends Bus {
  constructor(id, name, rute, lat, lng, acTemp = 22) {
    super(id, name, rute, lat, lng)
    this.acTemp = acTemp
    this.acStatus = true
    this.type = 'AC'
  }

  getInfo() {
    const baseInfo = super.getInfo()
    return {
      ...baseInfo,
      type: 'AC Bus',
      acTemp: `${this.acTemp}°C`,
      acStatus: this.acStatus ? 'ON' : 'OFF'
    }
  }

  setACTemp(temp) {
    if (temp < 16 || temp > 28) {
      throw new BusSystemException(
        `Suhu AC tidak valid: ${temp}°C (harus 16-28)`,
        'INVALID_AC_TEMP'
      )
    }
    this.acTemp = temp
    console.log(`❄️ AC temp set to ${this.acTemp}°C`)
  }

  toggleAC() {
    this.acStatus = !this.acStatus
    console.log(`AC ${this.acStatus ? 'ON' : 'OFF'}`)
  }
}

class Halte extends TransportEntity {
  constructor(id, name, lat, lng, fakultas) {
    super(id, name, { lat, lng })
    this.fakultas = fakultas
    this.waitingPassengers = 0
    this.facilities = []
    this.routes = []
  }

  // Polymorphism - Override getInfo()
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: 'Halte',
      fakultas: this.fakultas,
      location: this.location,
      waitingPassengers: this.waitingPassengers,
      facilities: this.facilities,
      routes: this.routes
    }
  }

  addWaitingPassenger(count = 1) {
    this.waitingPassengers += count
    console.log(`🚶 ${count} penumpang menunggu di ${this.name}. Total: ${this.waitingPassengers}`)
  }

  boardPassengers(bus, count) {
    try {
      if (count > this.waitingPassengers) {
        throw new BusSystemException(
          `Tidak cukup penumpang menunggu. Tersedia: ${this.waitingPassengers}`,
          'INSUFFICIENT_PASSENGERS'
        )
      }
      
      bus.addPassenger(count)
      this.waitingPassengers -= count
      console.log(`✅ ${count} penumpang naik ${bus.name} di ${this.name}`)
      
    } catch (error) {
      if (error instanceof BusFullException) {
        console.log(`❌ ${bus.name} penuh! ${this.waitingPassengers} masih menunggu`)
      }
      throw error
    }
  }

  addFacility(facility) {
    this.facilities.push(facility)
  }

  addRoute(routeId) {
    if (!this.routes.includes(routeId)) {
      this.routes.push(routeId)
    }
  }
}

class BusManager {
  constructor() {
    this.buses = new Map()
    this.haltes = new Map()
    this.routes = new Map()
  }

  // Bus Management
  addBus(bus) {
    if (!(bus instanceof Bus)) {
      throw new BusSystemException('Invalid bus object', 'INVALID_BUS')
    }
    this.buses.set(bus.id, bus)
    console.log(`✅ ${bus.name} ditambahkan ke sistem`)
  }

  getBus(busId) {
    const bus = this.buses.get(busId)
    if (!bus) {
      throw new BusNotFoundException(busId)
    }
    return bus
  }

  getAllBuses() {
    return Array.from(this.buses.values())
  }

  getBusesByRoute(routeId) {
    return this.getAllBuses().filter(bus => bus.rute === routeId)
  }

  getActiveBuses() {
    return this.getAllBuses().filter(bus => bus.status === 'Aktif')
  }

  // Halte Management
  addHalte(halte) {
    if (!(halte instanceof Halte)) {
      throw new BusSystemException('Invalid halte object', 'INVALID_HALTE')
    }
    this.haltes.set(halte.id, halte)
    console.log(`✅ Halte ${halte.name} ditambahkan`)
  }

  getHalte(halteId) {
    const halte = this.haltes.get(halteId)
    if (!halte) {
      throw new HalteNotFoundException(halteId)
    }
    return halte
  }

  getAllHaltes() {
    return Array.from(this.haltes.values())
  }

  // Route Management
  addRoute(routeId, routeData) {
    this.routes.set(routeId, routeData)
  }

  getRoute(routeId) {
    const route = this.routes.get(routeId)
    if (!route) {
      throw new InvalidRouteException(routeId)
    }
    return route
  }

  // Complex Operations with Exception Handling
  simulateBusBoarding(busId, halteId, passengerCount) {
    try {
      const bus = this.getBus(busId)
      const halte = this.getHalte(halteId)
      
      halte.boardPassengers(bus, passengerCount)
      
      return {
        success: true,
        message: `${passengerCount} penumpang berhasil naik ${bus.name}`,
        busOccupancy: bus.getOccupancyRate(),
        remainingWaiting: halte.waitingPassengers
      }
      
    } catch (error) {
      if (error instanceof BusSystemException) {
        console.error(`❌ Boarding Error: ${error.message}`)
        return {
          success: false,
          error: error.message,
          code: error.code
        }
      }
      throw error
    }
  }

  // Polymorphic method
  getAllEntitiesInfo() {
    const entities = [
      ...this.getAllBuses(),
      ...this.getAllHaltes()
    ]
    
    return entities.map(entity => entity.getInfo())
  }

  // System Statistics
  getSystemStats() {
    const buses = this.getAllBuses()
    const activeBuses = this.getActiveBuses()
    
    return {
      totalBuses: buses.length,
      activeBuses: activeBuses.length,
      totalPassengers: buses.reduce((sum, bus) => sum + bus.penumpang, 0),
      averageOccupancy: Math.round(
        buses.reduce((sum, bus) => sum + bus.getOccupancyRate(), 0) / buses.length
      ),
      totalHaltes: this.haltes.size,
      totalRoutes: this.routes.size
    }
  }
}

const manager = new BusManager()

// Create Buses (Polymorphism)
const bus1 = new ACBus(1, 'Bus Dipyo 1', 1, -7.0500, 110.4390, 22)
const bus2 = new ElectricBus(2, 'Bus Dipyo 2', 2, -7.0495, 110.4385, 85)
const bus3 = new Bus(3, 'Bus Dipyo 3', 3, -7.0485, 110.4400)

// Add buses
manager.addBus(bus1)
manager.addBus(bus2)
manager.addBus(bus3)

// Create Haltes
const terminal = new Halte(1, 'Terminal', -7.0520, 110.4370, 'Terminal Tembalang')
const feb = new Halte(2, 'FEB', -7.0500, 110.4390, 'Fakultas Ekonomika & Bisnis')

terminal.addFacility('Shelter')
terminal.addFacility('Security')
terminal.addRoute(1)
terminal.addRoute(2)

manager.addHalte(terminal)
manager.addHalte(feb)

// Demo Polymorphism - getInfo() berbeda untuk setiap class
console.log('=== POLYMORPHISM DEMO ===')
console.log(bus1.getInfo()) // AC Bus info
console.log(bus2.getInfo()) // Electric Bus info
console.log(terminal.getInfo()) // Halte info

console.log('\n=== EXCEPTION HANDLING DEMO ===')

try {
  terminal.addWaitingPassenger(5)
  const result = manager.simulateBusBoarding(1, 1, 5)
  console.log('Result:', result)
  
} catch (error) {
  console.error('Error:', error.message)
}

try {
  bus1.addPassenger(35) 
  
} catch (error) {
  if (error instanceof BusFullException) {
    console.log('❌ Caught:', error.message)
    console.log('Code:', error.code)
  }
}

try {
  manager.getBus(999) 
  
} catch (error) {
  if (error instanceof BusNotFoundException) {
    console.log('❌ Caught:', error.message)
  }
}


console.log('\n=== SYSTEM STATS ===')
console.log(manager.getSystemStats())

export {
  // Exceptions
  BusSystemException,
  BusNotFoundException,
  BusFullException,
  InvalidRouteException,
  HalteNotFoundException,
  
  // Classes
  TransportEntity,
  Bus,
  ElectricBus,
  ACBus,
  Halte,
  BusManager
}