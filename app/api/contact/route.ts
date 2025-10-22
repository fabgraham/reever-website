import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per window
const MAX_FIELD_LENGTH = 1000;
const MAX_MESSAGE_LENGTH = 2000;

// Input sanitization function
function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .substring(0, MAX_FIELD_LENGTH); // Limit length
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

// Phone validation (basic)
function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)\.]{7,20}$/;
  return phoneRegex.test(phone);
}

// Date validation
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date instanceof Date && !isNaN(date.getTime()) && date > now;
}

// Rate limiting check
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Verify content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    
    // Extract and sanitize form data
    const {
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      date: rawDate,
      venue: rawVenue,
      message: rawMessage,
      csrfToken
    } = body;
    
    // Basic CSRF protection (in production, implement proper token validation)
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'Security token missing' },
        { status: 403 }
      );
    }
    
    // Sanitize inputs
    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail);
    const phone = sanitizeInput(rawPhone);
    const date = sanitizeInput(rawDate);
    const venue = sanitizeInput(rawVenue);
    const message = rawMessage ? rawMessage.trim().substring(0, MAX_MESSAGE_LENGTH) : '';
    
    // Validate required fields
    if (!name || !email || !date || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }
    
    // Validate date
    if (!isValidDate(date)) {
      return NextResponse.json(
        { error: 'Invalid or past date' },
        { status: 400 }
      );
    }
    
    // Check for suspicious content (basic spam detection)
    const suspiciousPatterns = [
      /https?:\/\//gi, // URLs in message
      /\b(viagra|casino|lottery|winner)\b/gi, // Common spam words
      /(.)\1{10,}/gi, // Repeated characters
    ];
    
    const fullText = `${name} ${email} ${message} ${venue}`.toLowerCase();
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(fullText));
    
    if (isSuspicious) {
      return NextResponse.json(
        { error: 'Message flagged as potential spam' },
        { status: 400 }
      );
    }
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the submission
    
    // For now, we'll just log the sanitized data
    console.log('Contact form submission:', {
      name,
      email,
      phone: phone || 'Not provided',
      date,
      venue: venue || 'Not provided',
      message,
      timestamp: new Date().toISOString(),
      clientIP
    });
    
    // TODO: Implement actual email sending here
    // Example: await sendEmail({ to: 'band@reever.com', subject: 'New Booking Inquiry', ... });
    
    return NextResponse.json(
      { message: 'Thank you! We have received your enquiry and will be in touch soon.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}