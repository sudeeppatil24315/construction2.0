import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';
import fc from 'fast-check';

// Mock fetch
global.fetch = jest.fn();

/**
 * Feature: sb-infra-landing-page
 * Property 19: Form Submission API Call
 * Validates: Requirements 17.1
 * 
 * For any contact form submission, the data should be sent to the backend API endpoint via HTTP POST.
 * This property verifies that:
 * 1. The API endpoint '/api/contact' is called
 * 2. The HTTP method is POST
 * 3. The Content-Type header is 'application/json'
 * 4. The request body contains the submitted form data
 */
describe('Property 19: Form Submission API Call', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  // Arbitrary generators for valid form data
  const validNameArb = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z\s'-]{1,99}$/)
    .filter(s => s.trim().length >= 2 && s.trim().length <= 100);
  
  const validEmailArb = fc
    .tuple(
      fc.stringMatching(/^[a-z0-9]{1,20}$/),
      fc.stringMatching(/^[a-z0-9]{1,20}$/),
      fc.constantFrom('com', 'org', 'net', 'edu', 'io')
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);
  
  const validPhoneArb = fc.oneof(
    fc.constant(''),
    fc.integer({ min: 1000000000, max: 9999999999 }).map(n => n.toString())
  );
  
  const validProjectTypeArb = fc.constantFrom(
    'Residential Construction',
    'Commercial Project',
    'Industrial Facility',
    'Renovation & Remodeling',
    'Infrastructure Development',
    'Construction Consulting',
    'Other'
  );
  
  const validBudgetArb = fc.oneof(
    fc.constant(''),
    fc.constantFrom(
      'Under $50,000',
      '$50,000 - $100,000',
      '$100,000 - $250,000',
      '$250,000 - $500,000',
      '$500,000 - $1,000,000',
      'Over $1,000,000',
      'Not Sure'
    )
  );
  
  const validMessageArb = fc
    .stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'-]{9,999}$/)
    .filter(s => s.trim().length >= 10 && s.trim().length <= 1000);

  it('should send POST request to /api/contact endpoint for any valid form submission', async () => {
    // Generate multiple test cases
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      5 // Test with 5 different form data combinations
    );

    for (const formData of examples) {
      // Clean up before rendering
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Thank you for your inquiry!',
          submissionId: `SUB-${Date.now()}-test`,
        }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill out the form
        fireEvent.change(screen.getByLabelText(/full name/i), {
          target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: formData.email },
        });
        if (formData.phone) {
          fireEvent.change(screen.getByLabelText(/phone number/i), {
            target: { value: formData.phone },
          });
        }
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        if (formData.budget) {
          fireEvent.change(screen.getByLabelText(/estimated budget/i), {
            target: { value: formData.budget },
          });
        }
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /send message/i });
        fireEvent.click(submitButton);

        // Wait for the API call to be made
        await waitFor(
          () => {
            expect(global.fetch).toHaveBeenCalled();
          },
          { timeout: 3000 }
        );

        // Verify the API endpoint is correct
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.any(Object)
        );

        // Get the call arguments
        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        const [url, options] = callArgs;

        // Verify the endpoint URL
        expect(url).toBe('/api/contact');

        // Verify the HTTP method is POST
        expect(options.method).toBe('POST');

        // Verify the Content-Type header
        expect(options.headers).toEqual({
          'Content-Type': 'application/json',
        });

        // Verify the request body is a JSON string
        expect(typeof options.body).toBe('string');

        // Parse and verify the request body contains the form data
        const requestBody = JSON.parse(options.body);
        expect(requestBody.name).toBe(formData.name);
        expect(requestBody.email).toBe(formData.email);
        expect(requestBody.projectType).toBe(formData.projectType);
        expect(requestBody.message.trim()).toBe(formData.message.trim());
        
        // Verify optional fields
        if (formData.phone) {
          expect(requestBody.phone).toBe(formData.phone);
        }
        if (formData.budget) {
          expect(requestBody.budget).toBe(formData.budget);
        }
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should include all required form fields in the API request body', async () => {
    // Generate test cases
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3
    );

    for (const formData of examples) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill and submit form
        fireEvent.change(screen.getByLabelText(/full name/i), {
          target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        });

        const requestBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);

        // Verify all required fields are present
        expect(requestBody).toHaveProperty('name');
        expect(requestBody).toHaveProperty('email');
        expect(requestBody).toHaveProperty('projectType');
        expect(requestBody).toHaveProperty('message');

        // Verify required fields are not empty
        expect(requestBody.name).toBeTruthy();
        expect(requestBody.email).toBeTruthy();
        expect(requestBody.projectType).toBeTruthy();
        expect(requestBody.message).toBeTruthy();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should send API request with proper JSON structure', async () => {
    // Generate test cases
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3
    );

    for (const formData of examples) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill and submit form
        fireEvent.change(screen.getByLabelText(/full name/i), {
          target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: formData.email },
        });
        if (formData.phone) {
          fireEvent.change(screen.getByLabelText(/phone number/i), {
            target: { value: formData.phone },
          });
        }
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        if (formData.budget) {
          fireEvent.change(screen.getByLabelText(/estimated budget/i), {
            target: { value: formData.budget },
          });
        }
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        });

        const requestBodyString = (global.fetch as jest.Mock).mock.calls[0][1].body;

        // Verify the body is valid JSON
        expect(() => JSON.parse(requestBodyString)).not.toThrow();

        const requestBody = JSON.parse(requestBodyString);

        // Verify the structure is a plain object
        expect(typeof requestBody).toBe('object');
        expect(requestBody).not.toBeNull();
        expect(Array.isArray(requestBody)).toBe(false);

        // Verify all values are strings (as expected by the API)
        Object.values(requestBody).forEach(value => {
          expect(typeof value).toBe('string');
        });
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should make exactly one API call per form submission', async () => {
    // Generate test cases
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3
    );

    for (const formData of examples) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill and submit form
        fireEvent.change(screen.getByLabelText(/full name/i), {
          target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        });

        // Verify exactly one API call was made
        expect(global.fetch).toHaveBeenCalledTimes(1);
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should not make API call if form validation fails', async () => {
    // Test with invalid data (empty required fields)
    document.body.innerHTML = '';
    jest.clearAllMocks();

    const { unmount } = render(<ContactForm />);

    try {
      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));

      // Wait a bit to ensure no API call is made
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify no API call was made
      expect(global.fetch).not.toHaveBeenCalled();
    } finally {
      unmount();
      document.body.innerHTML = '';
    }
  });

  it('should preserve form data structure when sending to API', async () => {
    // Generate test cases with all fields populated
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: fc.integer({ min: 1000000000, max: 9999999999 }).map(n => n.toString()),
        projectType: validProjectTypeArb,
        budget: fc.constantFrom(
          'Under $50,000',
          '$50,000 - $100,000',
          '$100,000 - $250,000'
        ),
        message: validMessageArb,
      }),
      3
    );

    for (const formData of examples) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill all form fields
        fireEvent.change(screen.getByLabelText(/full name/i), {
          target: { value: formData.name },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: formData.email },
        });
        fireEvent.change(screen.getByLabelText(/phone number/i), {
          target: { value: formData.phone },
        });
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        fireEvent.change(screen.getByLabelText(/estimated budget/i), {
          target: { value: formData.budget },
        });
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        });

        const requestBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);

        // Verify all fields are preserved in the API request
        expect(requestBody.name).toBe(formData.name);
        expect(requestBody.email).toBe(formData.email);
        expect(requestBody.phone).toBe(formData.phone);
        expect(requestBody.projectType).toBe(formData.projectType);
        expect(requestBody.budget).toBe(formData.budget);
        expect(requestBody.message.trim()).toBe(formData.message.trim());
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);
});
