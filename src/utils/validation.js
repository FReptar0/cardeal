const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[\d\s\-\(\)]{10,}$/;

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email es requerido' };
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Contraseña es requerida' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Contraseña debe contener al menos una letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Contraseña debe contener al menos una letra mayúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Contraseña debe contener al menos un número' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone) => {
  if (!phone) return { isValid: true }; // Phone is optional in some contexts
  
  if (!PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Formato de teléfono inválido' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1f\x7f]/g, ''); // Remove control characters
};

export const validateLoginInput = ({ email, password }) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  
  const passwordValidation = validateRequired(password, 'Contraseña');
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }
  
  return { isValid: true };
};

export const validateRegistrationInput = ({ fullName, email, password, phone, birthDate }) => {
  const nameValidation = validateRequired(fullName, 'Nombre completo');
  if (!nameValidation.isValid) {
    return nameValidation;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }
  
  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.isValid) {
    return phoneValidation;
  }
  
  if (birthDate) {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Fecha de nacimiento inválida' };
    }
    
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 18) {
      return { isValid: false, error: 'Debe ser mayor de 18 años' };
    }
  }
  
  return { isValid: true };
};