import jwt from 'jsonwebtoken';
import { APIError, ErrorCodes, createAuthError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyJWT = (token) => {
  if (!JWT_SECRET) {
    throw createAuthError('JWT secret not configured', ErrorCodes.INTERNAL_ERROR);
  }
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createAuthError('Token expirado', ErrorCodes.AUTH_TOKEN_EXPIRED);
    }
    if (error.name === 'JsonWebTokenError') {
      throw createAuthError('Token inválido', ErrorCodes.AUTH_TOKEN_INVALID);
    }
    if (error.name === 'NotBeforeError') {
      throw createAuthError('Token no activo aún', ErrorCodes.AUTH_TOKEN_INVALID);
    }
    throw createAuthError('Error de autenticación', ErrorCodes.AUTH_TOKEN_INVALID);
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw createAuthError('Token de autorización requerido', ErrorCodes.AUTH_TOKEN_MISSING);
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    throw createAuthError('Formato de token inválido', ErrorCodes.AUTH_TOKEN_INVALID);
  }
  
  return authHeader.split(' ')[1];
};

export const authenticateRequest = (req) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyJWT(token);
    return { success: true, decoded };
  } catch (error) {
    if (error instanceof APIError) {
      return { 
        success: false, 
        error: error.message, 
        code: error.code 
      };
    }
    return { 
      success: false, 
      error: 'Error de autenticación', 
      code: ErrorCodes.AUTH_TOKEN_INVALID 
    };
  }
};

export const generateJWT = (payload, options = {}) => {
  if (!JWT_SECRET) {
    throw createAuthError('JWT secret not configured', ErrorCodes.INTERNAL_ERROR);
  }
  
  const defaultOptions = {
    expiresIn: '1h'
  };
  
  return jwt.sign(payload, JWT_SECRET, { ...defaultOptions, ...options });
};

export const authMiddleware = (req, res, next) => {
  const authResult = authenticateRequest(req);
  
  if (!authResult.success) {
    const statusCode = 401;
    
    return res.status(statusCode).json({
      message: authResult.error,
      ...(authResult.code === ErrorCodes.AUTH_TOKEN_EXPIRED && { expired: true })
    });
  }
  
  req.user = authResult.decoded;
  if (next) next();
  return authResult.decoded;
};