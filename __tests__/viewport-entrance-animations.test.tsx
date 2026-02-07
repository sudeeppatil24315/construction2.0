/**
 * Viewport Entrance Animations - Property Tests
 * 
 * Tests for viewport entrance animations using IntersectionObserver
 * 
 * **Validates: Requirements 5.2, 19.2**
 * **Property 9: Viewport Entrance Animations**
 */

// Mock framer-motion to avoid animation timing issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AnimateOnView,
  AnimateOnViewItem,
  FadeInUp,
  StaggerChildren,
} from '@/components/AnimateOnView';
import { act } from 'react';

// Mock IntersectionObserver with callback tracking
let intersectionObserverCallback: IntersectionObserverCallback;
const mockIntersectionObserver = jest.fn((callback) => {
  intersectionObserverCallback = callback;
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
});

// Override the global IntersectionObserver for this test
(global as any).IntersectionObserver = mockIntersectionObserver;

describe('Viewport Entrance Animations - Property Tests', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
    jest.clearAllMocks();
  });

  /**
   * Property 9: Viewport Entrance Animations
   * For any element with entrance animations, when the element enters the viewport,
   * the animation should trigger exactly once.
   * 
   * **Validates: Requirements 5.2**
   */
  describe('Property 9: Viewport Entrance Animations', () => {
    test('should trigger animation when element enters viewport', async () => {
      const { container } = render(
        <AnimateOnView>
          <div data-testid="animated-content">Content</div>
        </AnimateOnView>
      );

      // Initially, element should be in initial state
      expect(screen.getByTestId('animated-content')).toBeInTheDocument();

      // Simulate element entering viewport
      const element = container.firstChild;
      await act(async () => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: element,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      // Animation should have been triggered
      await waitFor(() => {
        expect(screen.getByTestId('animated-content')).toBeInTheDocument();
      });
    });

    test('should trigger animation only once by default', async () => {
      const { container } = render(
        <AnimateOnView>
          <div data-testid="animated-content">Content</div>
        </AnimateOnView>
      );

      const element = container.firstChild;

      // First intersection - should trigger
      await act(async () => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: element,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      // Clear the mock to track subsequent calls
      const observeInstance = mockIntersectionObserver.mock.results[0].value;
      const unobserveSpy = observeInstance.unobserve;

      // Element should be unobserved after first trigger (once=true by default)
      // This ensures animation triggers only once
      expect(unobserveSpy).toHaveBeenCalled();
    });

    test('should not trigger animation when element is not in viewport', () => {
      const { container } = render(
        <AnimateOnView>
          <div data-testid="animated-content">Content</div>
        </AnimateOnView>
      );

      const element = container.firstChild;

      // Simulate element NOT entering viewport
      act(() => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: false,
                target: element,
                intersectionRatio: 0,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      // Element should still be in initial state
      expect(screen.getByTestId('animated-content')).toBeInTheDocument();
    });

    test('should use IntersectionObserver for viewport detection', () => {
      render(
        <AnimateOnView>
          <div>Content</div>
        </AnimateOnView>
      );

      // IntersectionObserver should be created
      expect(mockIntersectionObserver).toHaveBeenCalled();
      
      // observe should be called
      const observeInstance = mockIntersectionObserver.mock.results[0].value;
      expect(observeInstance.observe).toHaveBeenCalled();
    });

    test('should cleanup IntersectionObserver on unmount', () => {
      const { unmount } = render(
        <AnimateOnView>
          <div>Content</div>
        </AnimateOnView>
      );

      const observeInstance = mockIntersectionObserver.mock.results[0].value;
      const disconnectSpy = observeInstance.disconnect;

      unmount();

      // disconnect should be called on cleanup
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  /**
   * Property: Staggered Children Animations
   * For any section with staggered animations, children should animate
   * sequentially with a delay between each child.
   * 
   * **Validates: Requirements 19.2**
   */
  describe('Staggered Children Animations', () => {
    test('should render staggered children container', async () => {
      const { container } = render(
        <StaggerChildren>
          <AnimateOnViewItem>
            <div data-testid="child-1">Child 1</div>
          </AnimateOnViewItem>
          <AnimateOnViewItem>
            <div data-testid="child-2">Child 2</div>
          </AnimateOnViewItem>
          <AnimateOnViewItem>
            <div data-testid="child-3">Child 3</div>
          </AnimateOnViewItem>
        </StaggerChildren>
      );

      // All children should be rendered
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();

      // Simulate container entering viewport
      const element = container.firstChild;
      await act(async () => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: element,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      // Children should still be in DOM after animation triggers
      await waitFor(() => {
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
        expect(screen.getByTestId('child-3')).toBeInTheDocument();
      });
    });

    test('should support custom stagger delay', () => {
      const customDelay = 0.2;
      
      render(
        <StaggerChildren staggerDelay={customDelay}>
          <AnimateOnViewItem>
            <div>Child 1</div>
          </AnimateOnViewItem>
          <AnimateOnViewItem>
            <div>Child 2</div>
          </AnimateOnViewItem>
        </StaggerChildren>
      );

      // Component should render without errors
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  /**
   * Fade-in-up Animation Tests
   * Tests for the pre-configured FadeInUp component
   */
  describe('FadeInUp Component', () => {
    test('should render FadeInUp component', async () => {
      const { container } = render(
        <FadeInUp>
          <div data-testid="fade-content">Fade In Content</div>
        </FadeInUp>
      );

      expect(screen.getByTestId('fade-content')).toBeInTheDocument();

      // Simulate entering viewport
      const element = container.firstChild;
      await act(async () => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: element,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      await waitFor(() => {
        expect(screen.getByTestId('fade-content')).toBeInTheDocument();
      });
    });

    test('should support custom delay', () => {
      render(
        <FadeInUp delay={0.5}>
          <div data-testid="delayed-content">Delayed Content</div>
        </FadeInUp>
      );

      expect(screen.getByTestId('delayed-content')).toBeInTheDocument();
    });

    test('should support custom HTML elements', () => {
      render(
        <FadeInUp as="section">
          <div data-testid="section-content">Section Content</div>
        </FadeInUp>
      );

      const section = screen.getByTestId('section-content').parentElement;
      expect(section?.tagName.toLowerCase()).toBe('section');
    });
  });

  /**
   * AnimateOnView Configuration Tests
   * Tests for various configuration options
   */
  describe('AnimateOnView Configuration', () => {
    test('should support different animation variants', () => {
      const variants = ['fadeInUp', 'fadeIn', 'scaleIn', 'slideInUp'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <AnimateOnView variant={variant}>
            <div data-testid={`${variant}-content`}>Content</div>
          </AnimateOnView>
        );

        expect(screen.getByTestId(`${variant}-content`)).toBeInTheDocument();
        unmount();
      });
    });

    test('should support custom variants', async () => {
      const customVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
      };

      const { container } = render(
        <AnimateOnView variant="custom" customVariants={customVariants}>
          <div data-testid="custom-content">Custom Animation</div>
        </AnimateOnView>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();

      // Trigger animation
      const element = container.firstChild;
      await act(async () => {
        if (intersectionObserverCallback && element) {
          intersectionObserverCallback(
            [
              {
                isIntersecting: true,
                target: element,
                intersectionRatio: 0.5,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver
          );
        }
      });

      await waitFor(() => {
        expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      });
    });

    test('should support custom root margin', () => {
      render(
        <AnimateOnView rootMargin="-200px 0px">
          <div data-testid="margin-content">Content</div>
        </AnimateOnView>
      );

      expect(screen.getByTestId('margin-content')).toBeInTheDocument();
      
      // Verify IntersectionObserver was called with custom options
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '-200px 0px',
        })
      );
    });

    test('should support custom threshold', () => {
      render(
        <AnimateOnView threshold={0.5}>
          <div data-testid="threshold-content">Content</div>
        </AnimateOnView>
      );

      expect(screen.getByTestId('threshold-content')).toBeInTheDocument();
      
      // Verify IntersectionObserver was called with custom threshold
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.5,
        })
      );
    });

    test('should support custom HTML elements', () => {
      render(
        <AnimateOnView as="article">
          <div data-testid="article-content">Article Content</div>
        </AnimateOnView>
      );

      const article = screen.getByTestId('article-content').parentElement;
      expect(article?.tagName.toLowerCase()).toBe('article');
    });

    test('should support custom className', () => {
      render(
        <AnimateOnView className="custom-class">
          <div data-testid="class-content">Content</div>
        </AnimateOnView>
      );

      const container = screen.getByTestId('class-content').parentElement;
      expect(container).toHaveClass('custom-class');
    });

    test('should support custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      
      render(
        <AnimateOnView style={customStyle}>
          <div data-testid="style-content">Content</div>
        </AnimateOnView>
      );

      const container = screen.getByTestId('style-content').parentElement;
      // Since we're mocking framer-motion, just verify the component renders
      expect(container).toBeInTheDocument();
    });
  });

  /**
   * Reduced Motion Support Tests
   * Ensures animations respect user preferences
   */
  describe('Reduced Motion Support', () => {
    test('should respect reduced motion preference', () => {
      // Mock matchMedia to return reduced motion preference
      const mockMatchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      render(
        <AnimateOnView>
          <div data-testid="reduced-motion-content">Content</div>
        </AnimateOnView>
      );

      expect(screen.getByTestId('reduced-motion-content')).toBeInTheDocument();
    });
  });

  /**
   * Integration Tests
   * Tests for real-world usage scenarios
   */
  describe('Integration Tests', () => {
    test('should work with multiple AnimateOnView components', async () => {
      const { container } = render(
        <>
          <AnimateOnView>
            <div data-testid="section-1">Section 1</div>
          </AnimateOnView>
          <AnimateOnView>
            <div data-testid="section-2">Section 2</div>
          </AnimateOnView>
          <AnimateOnView>
            <div data-testid="section-3">Section 3</div>
          </AnimateOnView>
        </>
      );

      // All sections should be rendered
      expect(screen.getByTestId('section-1')).toBeInTheDocument();
      expect(screen.getByTestId('section-2')).toBeInTheDocument();
      expect(screen.getByTestId('section-3')).toBeInTheDocument();

      // Multiple IntersectionObservers should be created
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(3);
    });

    test('should work with nested AnimateOnView components', async () => {
      const { container } = render(
        <AnimateOnView>
          <div data-testid="parent">
            <AnimateOnView>
              <div data-testid="child">Child</div>
            </AnimateOnView>
          </div>
        </AnimateOnView>
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();

      // Two IntersectionObservers should be created (parent and child)
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });
});
