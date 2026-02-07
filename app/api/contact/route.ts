import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema matching the frontend
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  projectType: z.string().min(1),
  budget: z.string().optional(),
  message: z.string().min(10).max(1000),
});

// Rate limiting storage (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client IP address from request
 */
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

/**
 * Check rate limit: 3 submissions per hour per IP
 */
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    // First submission or expired window
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + oneHour,
    });
    return { allowed: true };
  }
  
  if (entry.count >= 3) {
    // Rate limit exceeded
    return { allowed: false, resetTime: entry.resetTime };
  }
  
  // Increment count
  entry.count += 1;
  rateLimitStore.set(ip, entry);
  
  return { allowed: true };
}

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Sanitize form data
 */
function sanitizeFormData(data: any): any {
  return {
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    phone: data.phone ? sanitizeString(data.phone) : '',
    projectType: sanitizeString(data.projectType),
    budget: data.budget ? sanitizeString(data.budget) : '',
    message: sanitizeString(data.message),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now();
      const minutesUntilReset = Math.ceil((resetTime - Date.now()) / (60 * 1000));
      
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many submissions. Please try again in ${minutesUntilReset} minutes.`,
        },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Sanitize input data
    const sanitizedData = sanitizeFormData(body);
    
    // Validate sanitized data
    const validationResult = contactSchema.safeParse(sanitizedData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again.',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    // For now, we'll just log and return success
    
    console.log('Contact form submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
        submissionId: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong on our end. Please try again later.',
      },
      { status: 500 }
    );
  }
}
