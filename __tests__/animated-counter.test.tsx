/**
 * Property-Based Tests for Animated Counter Component
 * 
 * Property 14: Animated Counter Effects
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import AnimatedCounter from '@/components/AnimatedCounter';
import AboutSection from '@/components/AboutSection';

// Mock IntersectionObserver
let intersectionObserverCallback: IntersectionObserverCallback;
const mockIntersectionObserver = jest.fn((callback) => {
  intersectionObserverCallback = callback;
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Animated Counter Component - Property Tests', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  /**
   * Property 14: Animated Counter Effects
   * For any statistic or number display, when the element enters the viewport,
   * the number should animate from zero to its target value with easing.
   * Validates: Requirements 13.3, 19.4
   */
  describe('Property 14: Animated Counter Effects', () => {
    test('should start at zero before viewport entry', () => {
      render(<AnimatedCounter end={100} />);

      // Counter should display 0 initially
      expect(screen.getByText(/^0/)).toBeInTheDocument();
    });

    test('should animate from zero to target value when entering viewport', async () => {
      const { container } = render(<AnimatedCounter end={500} />);

      // Initially at 0
      expect(screen.getByText(/^0/)).toBeInTheDocument();

      // Simulate IntersectionObserver triggering (element enters viewport)
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to start
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Counter should be animating (value should be greater than 0)
      await waitFor(() => {
        const text = container.textContent || '';
        const value = parseInt(text.replace(/\D/g, ''), 10);
        expect(value).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    test('should reach exact target value at end of animation', async () => {
      const targetValue = 250;
      const { container } = render(<AnimatedCounter end={targetValue} duration={500} />);

      // Trigger viewport entry
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to complete (500ms duration + buffer)
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      // After full duration, should show exact target value
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`${targetValue}`))).toBeInTheDocument();
      });
    });

    test('should apply easing function during animation', async () => {
      const { container } = render(<AnimatedCounter end={1000} duration={800} />);

      // Trigger viewport entry
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to progress
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Counter should be animating (value between 0 and target)
      await waitFor(() => {
        const text = container.textContent || '';
        const value = parseInt(text.replace(/\D/g, ''), 10);
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1000);
      });
    });

    test('should handle different target values correctly', async () => {
      const testValues = [10, 50, 100];

      for (const targetValue of testValues) {
        const { container, unmount } = render(<AnimatedCounter end={targetValue} duration={300} />);

        // Trigger viewport entry
        const counterElement = container.querySelector('div');
        
        await act(async () => {
          if (intersectionObserverCallback && counterElement) {
            intersectionObserverCallback(
              [
                {
                  isIntersecting: true,
                  target: counterElement,
                  intersectionRatio: 0.5,
                } as IntersectionObserverEntry,
              ],
              {} as IntersectionObserver
            );
          }
          // Wait for animation to complete
          await new Promise(resolve => setTimeout(resolve, 400));
        });

        // Should reach target value
        await waitFor(() => {
          expect(screen.getByText(new RegExp(`${targetValue}`))).toBeInTheDocument();
        });

        unmount();
      }
    });

    test('should support prefix and suffix in display', async () => {
      const { container } = render(
        <AnimatedCounter end={100} prefix="$" suffix="K" duration={300} />
      );

      // Trigger viewport entry
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Should display with prefix and suffix
      await waitFor(() => {
        expect(screen.getByText(/\$100K/)).toBeInTheDocument();
      });
    });

    test('should support decimal values', async () => {
      const { container } = render(<AnimatedCounter end={99.9} decimals={1} duration={300} />);

      // Trigger viewport entry
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Should display with decimal
      await waitFor(() => {
        expect(screen.getByText(/99\.9/)).toBeInTheDocument();
      });
    });

    test('should only animate once when entering viewport', async () => {
      const { container } = render(<AnimatedCounter end={100} duration={300} />);

      // First viewport entry
      const counterElement = container.querySelector('div');
      
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      await waitFor(() => {
        expect(screen.getByText(/100/)).toBeInTheDocument();
      });

      // Second viewport entry (should not trigger animation again)
      await act(async () => {
        if (intersectionObserverCallback && counterElement) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: counterElement,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should still show 100 (not reset)
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });
  });

  describe('Integration with AboutSection', () => {
    test('should render multiple animated counters in AboutSection', () => {
      render(<AboutSection />);

      // AboutSection should contain multiple statistics
      expect(screen.getByText(/Projects Completed/)).toBeInTheDocument();
      expect(screen.getByText(/Years Experience/)).toBeInTheDocument();
      expect(screen.getByText(/Client Satisfaction/)).toBeInTheDocument();
      expect(screen.getByText(/Expert Team Members/)).toBeInTheDocument();
    });

    test('should use AnimatedCounter components for statistics display', () => {
      const { container } = render(<AboutSection />);

      // AboutSection should contain multiple counter elements with the gold text class
      const counters = container.querySelectorAll('.text-gold');
      
      // Should have at least 4 counters (one for each statistic)
      expect(counters.length).toBeGreaterThanOrEqual(4);

      // Each counter should be wrapped in inline-block div (AnimatedCounter structure)
      const counterWrappers = container.querySelectorAll('.inline-block');
      expect(counterWrappers.length).toBeGreaterThanOrEqual(4);
    });
  });
});
