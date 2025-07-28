export class APIError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const ErrorCodes = {
  // Authentication & Authorization
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_CREDENTIALS_INVALID: 'AUTH_CREDENTIALS_INVALID',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VALIDATION_EMAIL_INVALID: 'VALIDATION_EMAIL_INVALID',
  VALIDATION_PASSWORD_WEAK: 'VALIDATION_PASSWORD_WEAK',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  
  // Database
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_DUPLICATE_ENTRY: 'DB_DUPLICATE_ENTRY',
  DB_RECORD_NOT_FOUND: 'DB_RECORD_NOT_FOUND',
  
  // Business Logic
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
  BOOKING_CREATION_FAILED: 'BOOKING_CREATION_FAILED',
  PAYMENT_PROCESSING_FAILED: 'PAYMENT_PROCESSING_FAILED',
  
  // External Services
  EMAIL_SERVICE_FAILED: 'EMAIL_SERVICE_FAILED',
  TSD_SERVICE_FAILED: 'TSD_SERVICE_FAILED',
  
  // General
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};

export const createErrorResponse = (error, req = null, useBackwardCompatibility = true) => {
  let statusCode = 500;
  let code = ErrorCodes.INTERNAL_ERROR;
  let message = 'Error interno del servidor';
  let details = null;

  if (error instanceof APIError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = ErrorCodes.VALIDATION_FAILED;
    message = error.message;
  } else if (error.code === 11000) { // MongoDB duplicate key error
    statusCode = 409;
    code = ErrorCodes.DB_DUPLICATE_ENTRY;
    message = 'El recurso ya existe';
    details = { field: Object.keys(error.keyValue)[0] };
  } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    statusCode = 500;
    code = ErrorCodes.DB_QUERY_FAILED;
    message = 'Error en la base de datos';
  }

  // Log error for debugging
  console.error('API Error:', {
    code,
    message,
    statusCode,
    details,
    originalError: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    timestamp: new Date().toISOString()
  });

  // Return backward-compatible format for existing frontend code
  if (useBackwardCompatibility) {
    return {
      message,
      // Add additional fields for auth-specific errors if needed
      ...(code === ErrorCodes.AUTH_TOKEN_EXPIRED && { expired: true }),
      ...(process.env.NODE_ENV === 'development' && { 
        __debug: {
          code,
          details,
          stack: error.stack
        }
      })
    };
  }

  // New structured format (for future use)
  return {
    error: {
      code,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        originalError: error.message 
      })
    }
  };
};

export const handleAPIError = (error, req, res) => {
  const errorResponse = createErrorResponse(error, req);
  const statusCode = error instanceof APIError ? error.statusCode : 500;
  
  return res.status(statusCode).json(errorResponse);
};

// Wrapper for async route handlers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleAPIError(error, req, res);
    });
  };
};

// Common error creators
export const createValidationError = (message, field = null) => {
  return new APIError(message, ErrorCodes.VALIDATION_FAILED, 400, field ? { field } : null);
};

export const createAuthError = (message = 'No autorizado', code = ErrorCodes.AUTH_TOKEN_INVALID) => {
  return new APIError(message, code, 401);
};

export const createNotFoundError = (resource = 'Recurso') => {
  return new APIError(`${resource} no encontrado`, ErrorCodes.DB_RECORD_NOT_FOUND, 404);
};

export const createDuplicateError = (resource = 'Recurso', field = null) => {
  return new APIError(`${resource} ya existe`, ErrorCodes.DB_DUPLICATE_ENTRY, 409, field ? { field } : null);
};

export const createInternalError = (message = 'Error interno del servidor', details = null) => {
  return new APIError(message, ErrorCodes.INTERNAL_ERROR, 500, details);
};