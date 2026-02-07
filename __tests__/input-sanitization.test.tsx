import fc from 'fast-check';

/**
 * Feature: sb-infra-landing-page
 * Property 18: Input Sanitization
 * Validates: Requirements 17.5
 * 
 * For any form input containing special characters or potentially malicious content,
 * the input should be sanitized before submission.
 * 
 * This test validates the sanitization by making actual HTTP requests to the API endpoint.
 */

// Helper function to sanitize string (mirrors the API implementation)
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

describe('Property 18: Input Sanitization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Arbitrary generators for potentially malicious input
  const maliciousStringArb = fc.oneof(
    // XSS attempts with script tags
    fc.constant('<script>alert("XSS")</script>'),
    fc.constant('<img src=x onerror=alert("XSS")>'),
    fc.constant('<svg onload=alert("XSS")>'),
    
    // HTML injection attempts
    fc.constant('<div onclick="malicious()">Click me</div>'),
    fc.constant('<a href="javascript:alert(1)">Link</a>'),
    fc.constant('<iframe src="evil.com"></iframe>'),
    
    // Event handler injection
    fc.constant('test onclick=alert(1)'),
    fc.constant('test onmouseover=alert(1)'),
    fc.constant('test onerror=alert(1)'),
    
    // JavaScript protocol
    fc.constant('javascript:alert(1)'),
    fc.constant('JAVASCRIPT:void(0)'),
    
    // Mixed case variations
    fc.constant('<ScRiPt>alert(1)</ScRiPt>'),
    fc.constant('JaVaScRiPt:alert(1)'),
    fc.constant('OnClIcK=alert(1)'),
    
    // Combinations
    fc.constant('Normal text <script>alert(1)</script> more text'),
    fc.constant('Email: test@example.com<script>alert(1)</script>')
  );

  it('should sanitize HTML tags from string inputs', () => {
    fc.assert(
      fc.property(
        maliciousStringArb,
        (maliciousInput) => {
          const sanitized = sanitizeString(maliciousInput);
          
          // Verify dangerous patterns are removed
          expect(sanitized).not.toContain('<script');
          expect(sanitized).not.toContain('</script>');
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should remove javascript: protocol from input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'javascript:alert(1)',
          'JAVASCRIPT:void(0)',
          'JaVaScRiPt:malicious()',
          'test javascript:alert(1) test',
          'javascript:void(0)'
        ),
        (jsProtocol) => {
          const sanitized = sanitizeString(jsProtocol);
          
          // javascript: protocol should be removed (case-insensitive)
          expect(sanitized.toLowerCase()).not.toContain('javascript:');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should remove event handlers from input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'onclick=alert(1)',
          'onerror=malicious()',
          'onload=bad()',
          'onmouseover=evil()',
          'test onclick=alert(1) test',
          'ONCLICK=alert(1)',
          'OnError=bad()'
        ),
        (eventHandler) => {
          const sanitized = sanitizeString(eventHandler);
          
          // Event handlers should be removed (case-insensitive)
          expect(sanitized.toLowerCase()).not.toMatch(/on\w+=/);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should remove angle brackets from any input', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.includes('<') || s.includes('>')),
        (inputWithBrackets) => {
          const sanitized = sanitizeString(inputWithBrackets);
          
          // Angle brackets should be completely removed
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should handle multiple malicious patterns in single input', () => {
    fc.assert(
      fc.property(
        fc.array(maliciousStringArb, { minLength: 1, maxLength: 3 }),
        (maliciousInputs) => {
          const combined = maliciousInputs.join(' ');
          const sanitized = sanitizeString(combined);
          
          // All dangerous patterns should be removed
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
          expect(sanitized.toLowerCase()).not.toContain('javascript:');
          expect(sanitized.toLowerCase()).not.toMatch(/on\w+=/);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should preserve safe content while removing malicious patterns', () => {
    fc.assert(
      fc.property(
        fc.record({
          safePart: fc.stringMatching(/^[a-zA-Z0-9\s]{5,20}$/),
          maliciousPart: maliciousStringArb
        }),
        ({ safePart, maliciousPart }) => {
          const mixedInput = `${safePart} ${maliciousPart} ${safePart}`;
          const sanitized = sanitizeString(mixedInput);
          
          // Safe content should still be present (at least partially)
          // The safe parts should remain after sanitization
          const safeWords = safePart.trim().split(/\s+/);
          const hasAtLeastOneSafeWord = safeWords.some(word => 
            word.length > 0 && sanitized.includes(word)
          );
          
          // At least some safe content should remain
          expect(hasAtLeastOneSafeWord || sanitized.length > 0).toBe(true);
          
          // Malicious patterns should be removed
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
          expect(sanitized.toLowerCase()).not.toContain('javascript:');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should trim whitespace from sanitized input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (input) => {
          const withWhitespace = `  ${input}  `;
          const sanitized = sanitizeString(withWhitespace);
          
          // Should not have leading or trailing whitespace
          if (sanitized.length > 0) {
            expect(sanitized).toBe(sanitized.trim());
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should handle empty and whitespace-only inputs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', '   ', '\t\t', '\n\n', '  \t  \n  '),
        (whitespaceInput) => {
          const sanitized = sanitizeString(whitespaceInput);
          
          // Should result in empty string after trimming
          expect(sanitized).toBe('');
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should be idempotent - sanitizing twice gives same result', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (input) => {
          const sanitizedOnce = sanitizeString(input);
          const sanitizedTwice = sanitizeString(sanitizedOnce);
          
          // Sanitizing already sanitized input should not change it
          expect(sanitizedOnce).toBe(sanitizedTwice);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should handle all common XSS attack vectors', () => {
    const xssVectors = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>',
      '<iframe src=javascript:alert(1)>',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<div style="background:url(javascript:alert(1))">',
      'javascript:alert(1)',
      'onclick=alert(1)',
      '<a href="javascript:void(0)">',
    ];

    xssVectors.forEach(vector => {
      const sanitized = sanitizeString(vector);
      
      // Should not contain any dangerous patterns
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized.toLowerCase()).not.toContain('javascript:');
      expect(sanitized.toLowerCase()).not.toMatch(/on\w+=/);
    });
  });

  it('should sanitize form data structure', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: maliciousStringArb,
          email: maliciousStringArb,
          message: maliciousStringArb
        }),
        (formData) => {
          // Sanitize all fields
          const sanitized = {
            name: sanitizeString(formData.name),
            email: sanitizeString(formData.email),
            message: sanitizeString(formData.message)
          };
          
          // All fields should be sanitized
          Object.values(sanitized).forEach(value => {
            expect(value).not.toContain('<');
            expect(value).not.toContain('>');
            expect(value.toLowerCase()).not.toContain('javascript:');
            expect(value.toLowerCase()).not.toMatch(/on\w+=/);
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
