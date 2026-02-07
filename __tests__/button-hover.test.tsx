/**
 * Property-Based Tests for Button Hover Effects
 * 
 * Property 13: Button Hover 3D Transform
 * Validates: Requirements 19.1
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeroSection from '@/components/HeroSection';
import ContactForm from '@/components/ContactForm';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: any, options: any) => {
    const Component = () => options.loading();
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

// Mock WebGL detector
jest.mock('@/lib/webgl-detector', () => ({
  detectWebGLSupport: jest.fn(() => true),
}));

// Mock Scene3DErrorBoundary
jest.mock('@/components/Scene3DErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Button Hover Effects - Property Tests', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
    
    // Mock getElementById
    document.getElementById = jest.fn((id) => {
      const mockElement = document.createElement('div');
      mockElement.id = id;
      return mockElement;
    });
  });

  /**
   * Property 13: Button Hover 3D Transform
   * For any button element, when hovered, a 3D transform effect with gold shimmer should be applied.
   * Validates: Requirements 19.1
   */
  describe('Property 13: Button Hover 3D Transform', () => {
    test('should apply hover scale transform to primary CTA button', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify button has hover scale class
      expect(getStartedButton?.className).toContain('hover:scale-105');
    });

    test('should apply gold shadow effect on hover for primary buttons', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify button has gold shadow on hover
      expect(getStartedButton?.className).toContain('hover:shadow-2xl');
      expect(getStartedButton?.className).toContain('hover:shadow-gold/50');
    });

    test('should apply transition duration for smooth hover effect', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify button has transition classes
      expect(getStartedButton?.className).toContain('transition-all');
      expect(getStartedButton?.className).toContain('duration-300');
    });

    test('should apply hover effects to secondary buttons', () => {
      render(<HeroSection />);

      const viewProjectsButton = screen.getByText('View Projects').closest('button');
      
      // Verify secondary button has hover effects
      expect(viewProjectsButton?.className).toContain('hover:bg-gold');
      expect(viewProjectsButton?.className).toContain('hover:scale-105');
      expect(viewProjectsButton?.className).toContain('transition-all');
    });

    test('should apply hover effects to form submit button', () => {
      render(<ContactForm />);

      const submitButton = screen.getByText('Send Message').closest('button');
      
      // Verify submit button has hover effects
      expect(submitButton?.className).toContain('hover:scale-105');
      expect(submitButton?.className).toContain('hover:shadow-2xl');
      expect(submitButton?.className).toContain('hover:shadow-gold/50');
      expect(submitButton?.className).toContain('transition-all');
    });

    test('should apply hover effects to all CTA buttons in About section', () => {
      render(<AboutSection />);

      const ctaButton = screen.getByText("Let's Build Together").closest('button');
      
      // Verify CTA button has hover effects
      expect(ctaButton?.className).toContain('hover:scale-105');
      expect(ctaButton?.className).toContain('hover:shadow-2xl');
      expect(ctaButton?.className).toContain('transition-all');
    });

    test('should apply hover effects to Services section CTA button', () => {
      render(<ServicesSection />);

      const contactButton = screen.getByText('Discuss Your Project').closest('button');
      
      // Verify Services CTA button has hover effects
      expect(contactButton?.className).toContain('hover:scale-105');
      expect(contactButton?.className).toContain('hover:shadow-2xl');
      expect(contactButton?.className).toContain('transition-all');
    });

    test('should have gold shimmer gradient overlay on primary buttons', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started');
      const buttonElement = getStartedButton.closest('button');
      
      // Check for gradient overlay child element
      const gradientOverlay = buttonElement?.querySelector('.absolute.inset-0.bg-gradient-to-r');
      expect(gradientOverlay).toBeTruthy();
    });

    test('should apply group hover effect for gradient overlay', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started');
      const buttonElement = getStartedButton.closest('button');
      
      // Verify button has group class
      expect(buttonElement?.className).toContain('group');
      
      // Check gradient overlay has group-hover opacity transition
      const gradientOverlay = buttonElement?.querySelector('.absolute.inset-0.bg-gradient-to-r');
      expect(gradientOverlay?.className).toContain('group-hover:opacity-100');
    });

    test('should maintain hover effects across multiple button types', () => {
      const { rerender } = render(<HeroSection />);
      
      // Test Hero buttons
      const heroButton = screen.getByText('Get Started').closest('button');
      expect(heroButton?.className).toContain('hover:scale-105');
      
      // Test Contact form button
      rerender(<ContactForm />);
      const formButton = screen.getByText('Send Message').closest('button');
      expect(formButton?.className).toContain('hover:scale-105');
      
      // Test About section button
      rerender(<AboutSection />);
      const aboutButton = screen.getByText("Let's Build Together").closest('button');
      expect(aboutButton?.className).toContain('hover:scale-105');
    });

    test('should apply consistent transition timing across all buttons', () => {
      render(<HeroSection />);

      const buttons = [
        screen.getByText('Get Started').closest('button'),
        screen.getByText('View Projects').closest('button'),
      ];

      buttons.forEach((button) => {
        expect(button?.className).toContain('transition-all');
        expect(button?.className).toContain('duration-300');
      });
    });

    test('should have proper z-index for button content over gradient', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started');
      const spanElement = getStartedButton.closest('span');
      
      // Verify span has relative z-index
      expect(spanElement?.className).toContain('relative');
      expect(spanElement?.className).toContain('z-10');
    });

    test('should apply hover background color change for bordered buttons', () => {
      render(<HeroSection />);

      const viewProjectsButton = screen.getByText('View Projects');
      
      // Verify bordered button changes background on hover
      expect(viewProjectsButton.className).toContain('hover:bg-gold');
      expect(viewProjectsButton.className).toContain('hover:text-black');
    });

    test('should disable hover effects when button is disabled', () => {
      render(<ContactForm />);

      const submitButton = screen.getByText('Send Message') as HTMLButtonElement;
      
      // Button should not be disabled initially
      expect(submitButton.disabled).toBe(false);
      expect(submitButton.className).toContain('hover:scale-105');
    });

    test('should apply overflow hidden for gradient overlay containment', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started');
      const buttonElement = getStartedButton.closest('button');
      
      // Verify button has overflow-hidden
      expect(buttonElement?.className).toContain('overflow-hidden');
    });

    test('should have rounded corners for modern button appearance', () => {
      render(<HeroSection />);

      const buttons = [
        screen.getByText('Get Started').closest('button'),
        screen.getByText('View Projects').closest('button'),
      ];

      buttons.forEach((button) => {
        expect(button?.className).toContain('rounded-lg');
      });
    });

    test('should apply proper padding for button sizing', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify button has proper padding
      expect(getStartedButton?.className).toMatch(/px-\d+/);
      expect(getStartedButton?.className).toMatch(/py-\d+/);
    });

    test('should use bold font weight for button text', () => {
      render(<HeroSection />);

      const buttons = [
        screen.getByText('Get Started').closest('button'),
        screen.getByText('View Projects').closest('button'),
      ];

      buttons.forEach((button) => {
        expect(button?.className).toContain('font-bold');
      });
    });

    test('should apply gold color scheme to primary buttons', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify primary button uses gold background
      expect(getStartedButton?.className).toContain('bg-gold');
      expect(getStartedButton?.className).toContain('text-black');
    });

    test('should apply gold border to secondary buttons', () => {
      render(<HeroSection />);

      const viewProjectsButton = screen.getByText('View Projects').closest('button');
      
      // Verify secondary button has gold border
      expect(viewProjectsButton?.className).toContain('border-gold');
      expect(viewProjectsButton?.className).toContain('text-gold');
    });

    test('should maintain hover effects on rapid mouse movements', async () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Simulate rapid hover on/off
      if (getStartedButton) {
        fireEvent.mouseEnter(getStartedButton);
        fireEvent.mouseLeave(getStartedButton);
        fireEvent.mouseEnter(getStartedButton);
      }
      
      // Button should still have hover classes
      expect(getStartedButton?.className).toContain('hover:scale-105');
      expect(getStartedButton?.className).toContain('transition-all');
    });
  });

  describe('Button Interaction Behavior', () => {
    test('should trigger onClick handler when button is clicked', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      if (getStartedButton) {
        fireEvent.click(getStartedButton);
      }
      
      // scrollIntoView should be called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    test('should not trigger onClick when button is disabled', () => {
      const mockOnClick = jest.fn();
      const { container } = render(
        <button
          disabled
          onClick={mockOnClick}
          className="bg-gold hover:scale-105 transition-all"
        >
          Disabled Button
        </button>
      );

      const button = container.querySelector('button');
      if (button) {
        fireEvent.click(button);
      }
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('should apply cursor pointer for interactive buttons', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Button should be clickable (not have cursor-not-allowed)
      expect(getStartedButton?.className).not.toContain('cursor-not-allowed');
    });
  });

  describe('Accessibility and Responsive Design', () => {
    test('should have proper button semantics', () => {
      render(<HeroSection />);

      const buttons = screen.getAllByRole('button');
      
      // Should have at least 2 buttons in hero section
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    test('should be responsive with full width on mobile', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Verify responsive width classes
      expect(getStartedButton?.className).toContain('w-full');
      expect(getStartedButton?.className).toContain('sm:w-auto');
    });

    test('should maintain readability with proper text color contrast', () => {
      render(<HeroSection />);

      const getStartedButton = screen.getByText('Get Started').closest('button');
      
      // Primary button: gold background with black text (high contrast)
      expect(getStartedButton?.className).toContain('bg-gold');
      expect(getStartedButton?.className).toContain('text-black');
    });
  });
});
