
// Security utilities for input validation and sanitization
import DOMPurify from 'dompurify';

// Input validation schemas
export const ValidationRules = {
  PROJECT_NAME: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.,!?()]+$/
  },
  PROJECT_DESCRIPTION: {
    minLength: 1,
    maxLength: 1000,
    pattern: /^[a-zA-Z0-9\s\-_.,!?()\n]+$/
  },
  CATEGORY_NAME: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/
  },
  URL: {
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    pattern: /^[\+]?[0-9\s\-\(\)]{10,20}$/
  }
};

// Sanitize HTML content to prevent XSS
export const sanitizeHTML = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// Validate input against rules
export const validateInput = (value: string, rules: any): { isValid: boolean; error?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'Campo obrigatório' };
  }

  const trimmedValue = value.trim();

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return { isValid: false, error: `Mínimo de ${rules.minLength} caracteres` };
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return { isValid: false, error: `Máximo de ${rules.maxLength} caracteres` };
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return { isValid: false, error: 'Formato inválido' };
  }

  return { isValid: true };
};

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts?: number; blockTimeRemaining?: number } {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 0, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts };
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 0, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts };
    }

    // Check if user is blocked
    if (userAttempts.count >= this.maxAttempts) {
      const blockTimeRemaining = this.blockDurationMs - (now - userAttempts.lastAttempt);
      if (blockTimeRemaining > 0) {
        return { 
          allowed: false, 
          blockTimeRemaining: Math.ceil(blockTimeRemaining / 1000 / 60) // minutes
        };
      } else {
        // Block period has passed, reset
        this.attempts.set(identifier, { count: 0, lastAttempt: now });
        return { allowed: true, remainingAttempts: this.maxAttempts };
      }
    }

    return { 
      allowed: true, 
      remainingAttempts: this.maxAttempts - userAttempts.count 
    };
  }

  recordAttempt(identifier: string, success: boolean) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (success) {
      // Reset on successful login
      this.attempts.delete(identifier);
    } else {
      // Increment failed attempts
      if (userAttempts) {
        userAttempts.count++;
        userAttempts.lastAttempt = now;
      } else {
        this.attempts.set(identifier, { count: 1, lastAttempt: now });
      }
    }
  }
}

export const loginRateLimiter = new RateLimiter();

// Secure session management
export const SessionManager = {
  setSecureSession: (token: string, expiresIn: number = 3600000) => { // 1 hour default
    const sessionData = {
      token,
      expiresAt: Date.now() + expiresIn,
      createdAt: Date.now()
    };
    
    localStorage.setItem('secure_session', JSON.stringify(sessionData));
  },

  getSession: (): { token: string; isValid: boolean } | null => {
    try {
      const sessionStr = localStorage.getItem('secure_session');
      if (!sessionStr) return null;

      const sessionData = JSON.parse(sessionStr);
      const isValid = Date.now() < sessionData.expiresAt;

      if (!isValid) {
        SessionManager.clearSession();
        return null;
      }

      return { token: sessionData.token, isValid };
    } catch {
      SessionManager.clearSession();
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem('secure_session');
  },

  isSessionExpiringSoon: (thresholdMinutes: number = 5): boolean => {
    const session = SessionManager.getSession();
    if (!session) return false;

    const sessionStr = localStorage.getItem('secure_session');
    if (!sessionStr) return false;

    const sessionData = JSON.parse(sessionStr);
    const timeToExpiry = sessionData.expiresAt - Date.now();
    return timeToExpiry < (thresholdMinutes * 60 * 1000);
  }
};

// Content Security Policy helpers
export const CSPHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' https:; connect-src 'self' https:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// File upload security
export const FileUploadSecurity = {
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  
  validateFile: (file: File): { isValid: boolean; error?: string } => {
    if (!FileUploadSecurity.allowedImageTypes.includes(file.type)) {
      return { isValid: false, error: 'Tipo de arquivo não permitido. Use apenas JPEG, PNG, WebP ou GIF.' };
    }
    
    if (file.size > FileUploadSecurity.maxFileSize) {
      return { isValid: false, error: 'Arquivo muito grande. Máximo de 5MB.' };
    }
    
    return { isValid: true };
  }
};
