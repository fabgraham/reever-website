import { NextRequest } from 'next/server';

// Simple CSRF token generation (in production, use a more robust solution)
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Validate CSRF token (basic implementation)
export function validateCSRFToken(token: string, request: NextRequest): boolean {
  // In production, you'd validate against a stored token or use a signed token
  // For now, we'll just check if it exists and has the right format
  return Boolean(token && token.length === 64 && /^[a-f0-9]+$/.test(token));
}

// Generate a time-based token (more secure alternative)
export function generateTimedCSRFToken(secret: string = 'default-secret'): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${timestamp}.${randomHex}`;
}

// Validate time-based token (expires after 1 hour)
export function validateTimedCSRFToken(token: string, maxAge: number = 3600000): boolean {
  try {
    const [timestampStr, randomHex] = token.split('.');
    
    if (!timestampStr || !randomHex) {
      return false;
    }
    
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    
    // Check if token is expired
    if (now - timestamp > maxAge) {
      return false;
    }
    
    // Check format
    return /^[a-f0-9]{32}$/.test(randomHex);
  } catch {
    return false;
  }
}