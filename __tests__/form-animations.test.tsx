import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm Animations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Focus Animations', () => {
    test('should apply focus animation class when input is focused', () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      
      // Focus the input
      fireEvent.focus(nameInput);
      
      // Check if the input has the animate-input-focus class
      expect(nameInput).toHaveClass('animate-input-focus');
    });

    test('should apply gold border and shadow on focus', () => {
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Focus the input
      fireEvent.focus(emailInput);
      
      // Check if the input has the focus styling classes
      expect(emailInput).toHaveClass('border-gold');
      expect(emailInput).toHaveClass('shadow-lg');
      expect(emailInput).toHaveClass('shadow-gold/20');
    });

    test('should remove focus animation when input is blurred', () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      
      // Focus then blur
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);
      
      // After blur, the animate-input-focus class should not be present
      expect(nameInput).not.toHaveClass('animate-input-focus');
    });
  });

  describe('Loading Spinner', () => {
    test('should display loading spinner during form submission', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success' }),
        }), 100))
      );

      render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);
      
      // Check for loading state
      await waitFor(() => {
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });
      
      // Check that the button is disabled during submission
      expect(submitButton).toBeDisabled();
    });

    test('should show spinner animation with SVG', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success' }),
        }), 100))
      );

      render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Check for spinner SVG with animate-spin class
      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  describe('Success Animation', () => {
    test('should display celebratory animation on successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success' }),
      });

      const { container } = render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
      
      // Check for celebrate animation class
      const celebrateElement = container.querySelector('.animate-celebrate');
      expect(celebrateElement).toBeInTheDocument();
    });

    test('should display emoji with pulse animation on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success' }),
      });

      render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for success message
      await waitFor(() => {
        const emoji = screen.getByText('🎉');
        expect(emoji).toBeInTheDocument();
        expect(emoji).toHaveClass('animate-pulse-success');
      });
    });
  });

  describe('Error Animation', () => {
    test('should display shake animation on validation error', async () => {
      render(<ContactForm />);
      
      // Submit form without filling required fields
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for error messages
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/must be at least/i);
        expect(errorMessages.length).toBeGreaterThan(0);
        
        // Check that error messages have shake animation
        errorMessages.forEach((error) => {
          expect(error).toHaveClass('animate-shake');
        });
      });
    });

    test('should display shake animation on submission error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, message: 'Server error' }),
      });

      render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Check for shake animation class
      const errorMessage = screen.getByText(/something went wrong/i).closest('div');
      expect(errorMessage).toHaveClass('animate-shake');
    });
  });

  describe('Confetti Animation', () => {
    test('should render confetti component on successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success' }),
      });

      const { container } = render(<ContactForm />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: 'Residential Construction' } });
      fireEvent.change(screen.getByLabelText(/project details/i), { target: { value: 'This is a test message with enough characters' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for success and check for confetti
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
        
        // Check that confetti pieces are rendered
        const confettiPieces = container.querySelectorAll('.animate-confetti');
        expect(confettiPieces.length).toBeGreaterThan(0);
      });
    });
  });
});
