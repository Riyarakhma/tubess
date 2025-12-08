// Custom Exception Classes untuk Error Handling

export class DatabaseConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.timestamp = new Date().toISOString();
  }
}

export class DataRetrievalError extends Error {
  constructor(message) {
    super(message);
    this.name = "DataRetrievalError";
    this.timestamp = new Date().toISOString();
  }
}

export class DataInsertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "DataInsertionError";
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.timestamp = new Date().toISOString();
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
    this.timestamp = new Date().toISOString();
  }
}