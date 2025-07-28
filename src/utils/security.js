// Security utilities for input validation and sanitization

// Allowed file types for uploads
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed domains for iframe content
const ALLOWED_IFRAME_DOMAINS = [
  '360.pymesdigital.com.mx', // 360 resources domain
  'app-webhook-pd.pymesdigital.store', // AI chat in n8n
  'youtube.com',
  'www.youtube.com',
  'player.vimeo.com',
  'vimeo.com',
  'cardeal-beige.vercel.app', 
  'qardeal.com.mx'
];

/**
 * Validates and sanitizes URLs for iframe usage
 * @param {string} url - The URL to validate
 * @returns {object} - {isValid: boolean, sanitizedUrl: string, error?: string}
 */
export const validateIframeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, sanitizedUrl: '', error: 'URL is required' };
  }

  try {
    // Create URL object to parse and validate
    const urlObj = new URL(url);
    
    // Only allow https and http protocols (allow http for localhost)
    if (!['https:', 'http:'].includes(urlObj.protocol)) {
      return { isValid: false, sanitizedUrl: '', error: 'Invalid protocol' };
    }

    // For production, require HTTPS except for localhost
    if (urlObj.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(urlObj.hostname)) {
      return { isValid: false, sanitizedUrl: '', error: 'HTTPS required for external domains' };
    }

    // Check if domain is in allowed list
    const domain = urlObj.hostname.toLowerCase();
    const isAllowedDomain = ALLOWED_IFRAME_DOMAINS.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );

    if (!isAllowedDomain) {
      return { isValid: false, sanitizedUrl: '', error: 'Domain not allowed' };
    }

    // Return sanitized URL
    return { 
      isValid: true, 
      sanitizedUrl: urlObj.toString() 
    };
  } catch (error) {
    return { isValid: false, sanitizedUrl: '', error: 'Invalid URL format' };
  }
};

/**
 * Validates file uploads
 * @param {File} file - The file to validate
 * @returns {object} - {isValid: boolean, error?: string}
 */
export const validateFileUpload = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Only JPEG, PNG, and WebP images are allowed' 
    };
  }

  // Additional validation: check file extension matches MIME type
  const fileExtension = file.name.toLowerCase().split('.').pop();
  const expectedExtensions = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp']
  };

  const validExtensions = expectedExtensions[file.type] || [];
  if (!validExtensions.includes(fileExtension)) {
    return { 
      isValid: false, 
      error: 'File extension does not match file type' 
    };
  }

  return { isValid: true };
};

/**
 * Safely parses JWT token with proper error handling
 * @param {string} token - JWT token to parse
 * @returns {object} - {isValid: boolean, payload?: object, error?: string}
 */
export const safeParseJWT = (token) => {
  if (!token || typeof token !== 'string') {
    return { isValid: false, error: 'Token is required' };
  }

  try {
    // Split token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid token format' };
    }

    // Decode payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Basic validation - check if it looks like a JWT payload
    if (typeof parsedPayload !== 'object' || parsedPayload === null) {
      return { isValid: false, error: 'Invalid token payload' };
    }

    return { 
      isValid: true, 
      payload: parsedPayload 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Failed to parse token: ' + error.message 
    };
  }
};

/**
 * Checks if JWT token is expired
 * @param {object} payload - Parsed JWT payload
 * @returns {boolean} - true if expired
 */
export const isTokenExpired = (payload) => {
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Safely validates and parses JWT with expiration check
 * @param {string} token - JWT token
 * @returns {object} - {isValid: boolean, payload?: object, isExpired?: boolean, error?: string}
 */
export const validateJWT = (token) => {
  const parseResult = safeParseJWT(token);
  
  if (!parseResult.isValid) {
    return parseResult;
  }

  const isExpired = isTokenExpired(parseResult.payload);
  
  return {
    isValid: !isExpired,
    payload: parseResult.payload,
    isExpired,
    error: isExpired ? 'Token has expired' : undefined
  };
};