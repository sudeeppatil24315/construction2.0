import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';
import fc from 'fast-check';

// Mock fetch
global.fetch = jest.fn();

/**
 * Feature: sb-infra-landing-page
 * Property 20: Form Submission Error Handling
 * Validates: Requirements 17.3
 * 
 * For any failed form submission (API error, network error), an error message should be 
 * displayed with a retry option.
 * 
 * This property verifies that:
 * 1. Network errors display an appropriate error message
 * 2. Server errors (4xx, 5xx) display an appropriate error message
 * 3. Rate limit errors display an appropriate error message
 * 4. The form preserves user data after an error (allowing retry)
 * 5. The submit button remains enabled after an error (allowing retry)
 */
describe('Property 20: Form Submission Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  // Arbitrary generators for valid form data
  // Use simpler patterns to avoid newlines and special characters that cause issues
  const validNameArb = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z ]{1,30}$/)
    .filter(s => s.trim().length >= 2 && s.trim().length <= 100)
    .map(s => s.replace(/\s+/g, ' ').trim());
  
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
    .stringMatching(/^[a-zA-Z0-9 .,!?]{10,100}$/)
    .filter(s => s.trim().length >= 10 && s.trim().length <= 1000)
    .map(s => s.replace(/\s+/g, ' ').trim());

  it('should display error message for network errors and allow retry', async () => {
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
      3 // Test with 3 different form data combinations
    );

    for (const formData of examples) {
      // Clean up before rendering
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network request failed')
      );

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

        // Wait for error message to appear
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify error message is displayed
        const errorElements = screen.queryAllByText(/something went wrong/i);
        expect(errorElements.length).toBeGreaterThan(0);
        
        // Verify error message mentions network or connection
        expect(screen.getByText(/network|connection|try again/i)).toBeInTheDocument();

        // Verify form data is preserved (allowing retry)
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
        const projectTypeInput = screen.getByLabelText(/project type/i) as HTMLSelectElement;
        const messageInput = screen.getByLabelText(/project details/i) as HTMLTextAreaElement;

        expect(nameInput.value).toBe(formData.name);
        expect(emailInput.value).toBe(formData.email);
        expect(projectTypeInput.value).toBe(formData.projectType);
        expect(messageInput.value).toBe(formData.message);

        // Verify submit button is enabled (allowing retry)
        const submitButtonAfterError = screen.getByRole('button', { name: /send message/i });
        expect(submitButtonAfterError).not.toBeDisabled();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should display error message for server errors (500) and allow retry', async () => {
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
      
      // Mock server error (500)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong on our end. Please try again later.',
        }),
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

        // Wait for error message
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify error message is displayed
        const errorElements = screen.queryAllByText(/something went wrong/i);
        expect(errorElements.length).toBeGreaterThan(0);

        // Verify form data is preserved
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        expect(nameInput.value).toBe(formData.name);

        // Verify submit button is enabled for retry
        const submitButton = screen.getByRole('button', { name: /send message/i });
        expect(submitButton).not.toBeDisabled();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should display error message for rate limit errors (429) and allow retry', async () => {
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
      
      // Mock rate limit error (429)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many submissions. Please try again in 45 minutes.',
        }),
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

        // Wait for error message
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify error message is displayed
        const errorElements = screen.queryAllByText(/something went wrong/i);
        expect(errorElements.length).toBeGreaterThan(0);
        
        // Verify rate limit message is shown
        expect(screen.getByText(/too many submissions|try again/i)).toBeInTheDocument();

        // Verify form data is preserved
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        expect(nameInput.value).toBe(formData.name);

        // Verify submit button is enabled for retry
        const submitButton = screen.getByRole('button', { name: /send message/i });
        expect(submitButton).not.toBeDisabled();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should display error message for validation errors (400) and allow retry', async () => {
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
      
      // Mock validation error (400)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again.',
        }),
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

        // Wait for error message
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify error message is displayed
        const errorElements = screen.queryAllByText(/something went wrong/i);
        expect(errorElements.length).toBeGreaterThan(0);

        // Verify form data is preserved
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        expect(nameInput.value).toBe(formData.name);

        // Verify submit button is enabled for retry
        const submitButton = screen.getByRole('button', { name: /send message/i });
        expect(submitButton).not.toBeDisabled();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should allow successful retry after a failed submission', async () => {
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
      2 // Test with 2 examples for retry scenario
    );

    for (const formData of examples) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      // First attempt: Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network request failed')
      );

      const { unmount } = render(<ContactForm />);

      try {
        // Fill and submit form (first attempt)
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

        // Wait for error message
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify error is displayed
        const errorElements = screen.queryAllByText(/something went wrong/i);
        expect(errorElements.length).toBeGreaterThan(0);

        // Second attempt: Mock successful response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
            submissionId: `SUB-${Date.now()}-test`,
          }),
        });

        // Retry submission
        const submitButton = screen.getByRole('button', { name: /send message/i });
        fireEvent.click(submitButton);

        // Wait for success message
        await waitFor(
          () => {
            expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify success message is displayed
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();

        // Verify the API was called twice (once failed, once succeeded)
        expect(global.fetch).toHaveBeenCalledTimes(2);
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should preserve all form fields after error for any combination of filled fields', async () => {
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
      
      // Mock server error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          message: 'Server error',
        }),
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

        // Wait for error message
        await waitFor(
          () => {
            const errorElements = screen.queryAllByText(/something went wrong/i);
            expect(errorElements.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );

        // Verify all form fields are preserved
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
        const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
        const projectTypeInput = screen.getByLabelText(/project type/i) as HTMLSelectElement;
        const budgetInput = screen.getByLabelText(/estimated budget/i) as HTMLSelectElement;
        const messageInput = screen.getByLabelText(/project details/i) as HTMLTextAreaElement;

        expect(nameInput.value).toBe(formData.name);
        expect(emailInput.value).toBe(formData.email);
        expect(phoneInput.value).toBe(formData.phone);
        expect(projectTypeInput.value).toBe(formData.projectType);
        expect(budgetInput.value).toBe(formData.budget);
        expect(messageInput.value).toBe(formData.message);
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);

  it('should display appropriate error message for different error types', async () => {
    // Test different error scenarios
    const errorScenarios = [
      {
        type: 'network',
        mockError: () => {
          (global.fetch as jest.Mock).mockRejectedValueOnce(
            new Error('Network request failed')
          );
        },
        expectedText: /network|connection/i,
      },
      {
        type: 'server-500',
        mockError: () => {
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({
              success: false,
              message: 'Internal server error',
            }),
          });
        },
        expectedText: /something went wrong/i,
      },
      {
        type: 'rate-limit',
        mockError: () => {
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 429,
            json: async () => ({
              success: false,
              message: 'Too many submissions',
            }),
          });
        },
        expectedText: /too many submissions/i,
      },
    ];

    const formData = fc.sample(
      fc.record({
        name: validNameArb,
        email: validEmailArb,
        projectType: validProjectTypeArb,
        message: validMessageArb,
      }),
      1
    )[0];

    for (const scenario of errorScenarios) {
      document.body.innerHTML = '';
      jest.clearAllMocks();
      
      scenario.mockError();

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

        // Wait for error message
        await waitFor(
          () => {
            expect(screen.getByText(scenario.expectedText)).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify appropriate error message is displayed
        expect(screen.getByText(scenario.expectedText)).toBeInTheDocument();
      } finally {
        unmount();
        document.body.innerHTML = '';
      }
    }
  }, 30000);
});
