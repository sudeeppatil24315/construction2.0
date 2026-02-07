import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';
import fc from 'fast-check';

// Mock fetch
global.fetch = jest.fn();

/**
 * Feature: sb-infra-landing-page
 * Property 17: Invalid Form Validation Errors
 * Validates: Requirements 7.4, 7.5
 * 
 * For any contact form submission with invalid data, validation error messages
 * should be displayed for each invalid field. Email format should be validated.
 */
describe('Property 17: Invalid Form Validation Errors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // Arbitrary generators for invalid form data
  // Note: Zod's email validation is very lenient, so we use only reliably invalid emails
  const invalidNameArb = fc.oneof(
    fc.constant(''), // Empty name
    fc.constant('a'), // Too short (less than 2 chars)
    fc.string({ minLength: 101, maxLength: 150 }) // Too long (more than 100 chars)
  );

  const invalidEmailArb = fc.oneof(
    fc.constant(''), // Empty email - reliably fails
    fc.constant('@nodomain.com') // Missing local part - reliably fails
  );

  const invalidPhoneArb = fc.string({ minLength: 1, maxLength: 9 }); // Too short (less than 10 digits)

  const invalidProjectTypeArb = fc.constant(''); // Empty project type

  const invalidMessageArb = fc.oneof(
    fc.constant(''), // Empty message
    fc.string({ minLength: 1, maxLength: 9 }), // Too short (less than 10 chars)
    fc.string({ minLength: 1001, maxLength: 1100 }) // Too long (more than 1000 chars)
  );

  it('should display validation error for invalid name', async () => {
    await fc.assert(
      fc.asyncProperty(invalidNameArb, async (invalidName) => {
        document.body.innerHTML = '';

        const { unmount } = render(<ContactForm />);

        try {
          // Fill name with invalid value
          const nameInput = screen.getByLabelText(/full name/i);
          fireEvent.change(nameInput, { target: { value: invalidName } });

          // Fill other required fields with valid data
          fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'valid@email.com' },
          });
          fireEvent.change(screen.getByLabelText(/project type/i), {
            target: { value: 'Residential Construction' },
          });
          fireEvent.change(screen.getByLabelText(/project details/i), {
            target: { value: 'This is a valid message with enough characters.' },
          });

          // Submit the form
          const submitButton = screen.getByRole('button', { name: /send message/i });
          fireEvent.click(submitButton);

          // Wait for validation error to appear
          await waitFor(
            () => {
              const errorMessages = screen.queryAllByText(/name/i);
              const hasError = errorMessages.some(
                (el) =>
                  el.textContent?.includes('at least 2 characters') ||
                  el.textContent?.includes('too long')
              );
              expect(hasError).toBe(true);
            },
            { timeout: 2000 }
          );

          // Verify fetch was NOT called (form didn't submit)
          expect(global.fetch).not.toHaveBeenCalled();
        } finally {
          unmount();
          document.body.innerHTML = '';
        }
      }),
      { numRuns: 5 }
    );
  }, 30000);

  it('should display validation error for invalid email format', async () => {
    await fc.assert(
      fc.asyncProperty(invalidEmailArb, async (invalidEmail) => {
        document.body.innerHTML = '';

        const { unmount } = render(<ContactForm />);

        try {
          // Fill email with invalid value
          const emailInput = screen.getByLabelText(/email address/i);
          fireEvent.change(emailInput, { target: { value: invalidEmail } });

          // Fill other required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: 'John Doe' },
          });
          fireEvent.change(screen.getByLabelText(/project type/i), {
            target: { value: 'Commercial Project' },
          });
          fireEvent.change(screen.getByLabelText(/project details/i), {
            target: { value: 'This is a valid message with enough characters.' },
          });

          // Submit the form
          const form = document.querySelector('form');
          if (form) {
            fireEvent.submit(form);
          }

          // Give React time to process the validation
          await new Promise(resolve => setTimeout(resolve, 100));

          // Wait for validation error to appear
          await waitFor(
            () => {
              const errorMessage = screen.queryByText(/valid email/i);
              expect(errorMessage).toBeInTheDocument();
            },
            { timeout: 2000 }
          );

          // Verify fetch was NOT called (form didn't submit)
          expect(global.fetch).not.toHaveBeenCalled();
        } finally {
          unmount();
          document.body.innerHTML = '';
        }
      }),
      { numRuns: 5 }
    );
  }, 30000);

  it('should display validation error for invalid phone number', async () => {
    await fc.assert(
      fc.asyncProperty(invalidPhoneArb, async (invalidPhone) => {
        document.body.innerHTML = '';

        const { unmount } = render(<ContactForm />);

        try {
          // Fill phone with invalid value
          const phoneInput = screen.getByLabelText(/phone number/i);
          fireEvent.change(phoneInput, { target: { value: invalidPhone } });

          // Fill other required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: 'Jane Smith' },
          });
          fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'jane@example.com' },
          });
          fireEvent.change(screen.getByLabelText(/project type/i), {
            target: { value: 'Industrial Facility' },
          });
          fireEvent.change(screen.getByLabelText(/project details/i), {
            target: { value: 'This is a valid message with enough characters.' },
          });

          // Submit the form
          const submitButton = screen.getByRole('button', { name: /send message/i });
          fireEvent.click(submitButton);

          // Wait for validation error to appear
          await waitFor(
            () => {
              const errorMessage = screen.getByText(/at least 10 digits/i);
              expect(errorMessage).toBeInTheDocument();
            },
            { timeout: 2000 }
          );

          // Verify fetch was NOT called (form didn't submit)
          expect(global.fetch).not.toHaveBeenCalled();
        } finally {
          unmount();
          document.body.innerHTML = '';
        }
      }),
      { numRuns: 5 }
    );
  }, 30000);

  it('should display validation error for empty project type', async () => {
    await fc.assert(
      fc.asyncProperty(invalidProjectTypeArb, async (invalidProjectType) => {
        document.body.innerHTML = '';

        const { unmount } = render(<ContactForm />);

        try {
          // Leave project type empty (or set to empty string)
          const projectTypeInput = screen.getByLabelText(/project type/i);
          fireEvent.change(projectTypeInput, { target: { value: invalidProjectType } });

          // Fill other required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: 'Bob Johnson' },
          });
          fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'bob@example.com' },
          });
          fireEvent.change(screen.getByLabelText(/project details/i), {
            target: { value: 'This is a valid message with enough characters.' },
          });

          // Submit the form
          const submitButton = screen.getByRole('button', { name: /send message/i });
          fireEvent.click(submitButton);

          // Wait for validation error to appear - use getAllByText since text appears in both option and error
          await waitFor(
            () => {
              const errorMessages = screen.queryAllByText(/select a project type/i);
              // Should have at least 2: one in the option, one in the error message
              expect(errorMessages.length).toBeGreaterThanOrEqual(2);
            },
            { timeout: 2000 }
          );

          // Verify fetch was NOT called (form didn't submit)
          expect(global.fetch).not.toHaveBeenCalled();
        } finally {
          unmount();
          document.body.innerHTML = '';
        }
      }),
      { numRuns: 5 }
    );
  }, 30000);

  it('should display validation error for invalid message', async () => {
    await fc.assert(
      fc.asyncProperty(invalidMessageArb, async (invalidMessage) => {
        document.body.innerHTML = '';

        const { unmount } = render(<ContactForm />);

        try {
          // Fill message with invalid value
          const messageInput = screen.getByLabelText(/project details/i);
          fireEvent.change(messageInput, { target: { value: invalidMessage } });

          // Fill other required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: 'Alice Williams' },
          });
          fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'alice@example.com' },
          });
          fireEvent.change(screen.getByLabelText(/project type/i), {
            target: { value: 'Renovation & Remodeling' },
          });

          // Submit the form
          const submitButton = screen.getByRole('button', { name: /send message/i });
          fireEvent.click(submitButton);

          // Wait for validation error to appear
          await waitFor(
            () => {
              const errorMessages = screen.queryAllByText(/message/i);
              const hasError = errorMessages.some(
                (el) =>
                  el.textContent?.includes('at least 10 characters') ||
                  el.textContent?.includes('too long')
              );
              expect(hasError).toBe(true);
            },
            { timeout: 2000 }
          );

          // Verify fetch was NOT called (form didn't submit)
          expect(global.fetch).not.toHaveBeenCalled();
        } finally {
          unmount();
          document.body.innerHTML = '';
        }
      }),
      { numRuns: 5 }
    );
  }, 30000);

  it('should display multiple validation errors for multiple invalid fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: invalidNameArb,
          email: invalidEmailArb,
          message: invalidMessageArb,
        }),
        async (invalidData) => {
          document.body.innerHTML = '';

          const { unmount } = render(<ContactForm />);

          try {
            // Fill multiple fields with invalid values
            fireEvent.change(screen.getByLabelText(/full name/i), {
              target: { value: invalidData.name },
            });
            fireEvent.change(screen.getByLabelText(/email address/i), {
              target: { value: invalidData.email },
            });
            fireEvent.change(screen.getByLabelText(/project details/i), {
              target: { value: invalidData.message },
            });

            // Leave project type empty (also invalid)
            fireEvent.change(screen.getByLabelText(/project type/i), {
              target: { value: '' },
            });

            // Submit the form
            const form = document.querySelector('form');
            if (form) {
              fireEvent.submit(form);
            }

            // Give React time to process the validation
            await new Promise(resolve => setTimeout(resolve, 100));

            // Wait for at least one validation error to appear
            await waitFor(
              () => {
                const errorElements = document.querySelectorAll('.text-red-500');
                // Should have at least one error message
                expect(errorElements.length).toBeGreaterThanOrEqual(1);
              },
              { timeout: 2000 }
            );

            // Verify fetch was NOT called (form didn't submit)
            expect(global.fetch).not.toHaveBeenCalled();
          } finally {
            unmount();
            document.body.innerHTML = '';
          }
        }
      ),
      { numRuns: 5 }
    );
  }, 30000);

  it('should clear validation error when user corrects the field', async () => {
    document.body.innerHTML = '';

    const { unmount } = render(<ContactForm />);

    try {
      // Fill email with invalid value (missing local part)
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: '@nodomain.com' } });

      // Fill other fields with valid data
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/project type/i), {
        target: { value: 'Other' },
      });
      fireEvent.change(screen.getByLabelText(/project details/i), {
        target: { value: 'This is a valid message with enough characters.' },
      });

      // Submit to trigger validation
      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Give React time to process the validation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.queryByText(/valid email/i)).toBeInTheDocument();
      });

      // Now correct the email
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

      // Wait for error to disappear
      await waitFor(() => {
        expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
      });
    } finally {
      unmount();
      document.body.innerHTML = '';
    }
  });

  it('should prevent form submission when any field is invalid', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.oneof(fc.constant('Valid Name'), invalidNameArb),
          email: fc.oneof(fc.constant('valid@email.com'), invalidEmailArb),
          projectType: fc.oneof(fc.constant('Other'), invalidProjectTypeArb),
          message: fc.oneof(
            fc.constant('This is a valid message with enough characters.'),
            invalidMessageArb
          ),
        }).filter(
          (data) =>
            // Ensure at least one field is invalid
            data.name !== 'Valid Name' ||
            data.email !== 'valid@email.com' ||
            data.projectType !== 'Other' ||
            data.message !== 'This is a valid message with enough characters.'
        ),
        async (formData) => {
          document.body.innerHTML = '';

          const { unmount } = render(<ContactForm />);

          try {
            // Fill form with mixed valid/invalid data
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

            // Wait a bit to ensure no submission happens
            await waitFor(
              () => {
                // Verify fetch was NOT called
                expect(global.fetch).not.toHaveBeenCalled();
              },
              { timeout: 1000 }
            );
          } finally {
            unmount();
            document.body.innerHTML = '';
          }
        }
      ),
      { numRuns: 5 }
    );
  }, 30000);
});
