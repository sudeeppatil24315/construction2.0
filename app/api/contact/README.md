# Contact Form API

## Endpoint

`POST /api/contact`

## Description

Handles contact form submissions with input validation, sanitization, and rate limiting.

## Features

- ✅ Input validation using Zod schema
- ✅ Input sanitization to prevent XSS attacks
- ✅ Rate limiting (3 submissions per hour per IP)
- ✅ Proper error handling and responses
- ✅ Success/error state management

## Request Body

```json
{
  "name": "string (2-100 characters, required)",
  "email": "string (valid email format, required)",
  "phone": "string (optional)",
  "projectType": "string (required)",
  "budget": "string (optional)",
  "message": "string (10-1000 characters, required)"
}
```

## Response Formats

### Success Response (200)

```json
{
  "success": true,
  "message": "Thank you for your inquiry! We will get back to you within 24 hours.",
  "submissionId": "SUB-1234567890-abc123def"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input and try again.",
  "details": [
    {
      "path": ["email"],
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Rate Limit Error (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many submissions. Please try again in 45 minutes."
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong on our end. Please try again later."
}
```

## Security Features

### Input Sanitization

All input fields are sanitized to prevent XSS and injection attacks:

- Removes `<` and `>` characters to prevent HTML injection
- Removes `javascript:` protocol
- Removes event handlers like `onclick=`, `onload=`, etc.
- Trims whitespace

### Rate Limiting

- Maximum 3 submissions per hour per IP address
- Uses in-memory storage (consider Redis for production)
- Automatic cleanup of expired rate limit entries

### Validation

- Email format validation
- Required field validation
- String length validation
- Type validation

## Testing

Run the manual test suite:

```bash
npm run dev
npx tsx scripts/test-contact-api.ts
```

## Production Considerations

1. **Rate Limiting Storage**: Replace in-memory Map with Redis for distributed systems
2. **Email Notifications**: Integrate with email service (SendGrid, AWS SES, etc.)
3. **Database Storage**: Save submissions to database for record keeping
4. **CRM Integration**: Connect to CRM system for lead management
5. **Monitoring**: Add logging and error tracking (Sentry, DataDog, etc.)
6. **CAPTCHA**: Consider adding reCAPTCHA for additional spam protection

## Requirements Validated

- **17.1**: Form data sent to backend API endpoint via HTTP POST
- **17.2**: Success message displayed with expected response time
- **17.3**: Error handling with retry capability
- **17.4**: Rate limiting prevents spam (3 submissions per hour)
- **17.5**: Input sanitization before submission
