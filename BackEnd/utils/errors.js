// src/utils/errors.js

class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends Error {
    constructor(message = 'Validation failed', errors = []) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
      super(message);
      this.name = 'AuthenticationError';
      this.statusCode = 401;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class AuthorizationError extends Error {
    constructor(message = 'Access denied') {
      super(message);
      this.name = 'AuthorizationError';
      this.statusCode = 403;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class DatabaseError extends Error {
    constructor(message = 'Database operation failed') {
      super(message);
      this.name = 'DatabaseError';
      this.statusCode = 500;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class PaymentError extends Error {
    constructor(message = 'Payment processing failed') {
      super(message);
      this.name = 'PaymentError';
      this.statusCode = 402;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = {
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    DatabaseError,
    PaymentError
  };