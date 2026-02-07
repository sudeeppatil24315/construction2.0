import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';
import fc from 'fast-check';

// Mock fetch
global.fetch = jest.fn();

/**
 * Feature: sb-infra-landing-page
 * Property 16: Valid Form Submission Success
 * Validates: Requirements 7.3
 * 
 * For any contact form submission with valid data (proper email format, required fields filled),
 * a success message should be displayed.
 */
describe('Property 16: Valid Form Submission Success', () => {
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
  
  // Generate simple valid emails to avoid special characters that might fail validation
  const validEmailArb = fc
    .tuple(
      fc.stringMatching(/^[a-z0-9]{1,20}$/),
      fc.stringMatching(/^[a-z0-9]{1,20}$/),
      fc.constantFrom('com', 'org', 'net', 'edu')
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

  it('should display success message for any valid form submission', async () => {
    // Use a single test with multiple generated examples
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3 // Generate 3 examples
    );

    for (const formData of examples) {
      // Clean up before rendering
      document.body.innerHTML = '';
      jest.clearAllMocks(); // Clear mocks between iterations
      
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
          submissionId: `SUB-${Date.now()}-test`,
        }),
      });

      const { unmount } = render(<ContactForm />);

      try {
        // Fill out the form with generated valid data
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

        // Wait for success message to appear
        await waitFor(
          () => {
            expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify the success message is displayed
        const successMessage = screen.getByText(/message sent successfully/i);
        expect(successMessage).toBeInTheDocument();

        // Verify the API was called with the form data
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.any(String),
          })
        );

        // Verify the request body contains the form data
        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.name).toBe(formData.name);
        expect(requestBody.email).toBe(formData.email);
        expect(requestBody.projectType).toBe(formData.projectType);
        // Message might have whitespace normalized, so trim both for comparison
        expect(requestBody.message.trim()).toBe(formData.message.trim());
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should display success confirmation with expected response time', async () => {
    // Use a single test with multiple generated examples
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3 // Generate 3 examples
    );

    for (const formData of examples) {
      // Clean up before rendering
      document.body.innerHTML = '';
      jest.clearAllMocks(); // Clear mocks between iterations
      
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
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
        fireEvent.change(screen.getByLabelText(/project type/i), {
          target: { value: formData.projectType },
        });
        fireEvent.change(screen.getByLabelText(/project details/i), {
          target: { value: formData.message },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        // Wait for success message
        await waitFor(
          () => {
            expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify expected response time is mentioned (24 hours)
        expect(screen.getByText(/24 hours/i)).toBeInTheDocument();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should reset form after successful submission', async () => {
    // Use a single test with multiple generated examples
    const examples = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        phone: validPhoneArb,
        projectType: validProjectTypeArb,
        budget: validBudgetArb,
        message: validMessageArb,
      }),
      3 // Generate 3 examples
    );

    for (const formData of examples) {
      // Clean up before rendering
      document.body.innerHTML = '';
      jest.clearAllMocks(); // Clear mocks between iterations
      
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
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
        const projectTypeInput = screen.getByLabelText(/project type/i) as HTMLSelectElement;
        const messageInput = screen.getByLabelText(/project details/i) as HTMLTextAreaElement;

        fireEvent.change(nameInput, { target: { value: formData.name } });
        fireEvent.change(emailInput, { target: { value: formData.email } });
        fireEvent.change(projectTypeInput, { target: { value: formData.projectType } });
        fireEvent.change(messageInput, { target: { value: formData.message } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        // Wait for success message
        await waitFor(
          () => {
            expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify form fields are reset
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(projectTypeInput.value).toBe('');
        expect(messageInput.value).toBe('');
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);
});
