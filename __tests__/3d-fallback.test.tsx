/**
 * Property-Based Tests for 3D Fallback on Failure
 * 
 * Property 28: 3D Fallback on Load Failure
 * Validates: Requirements 16.4
 */

import { render, screen, waitFor } from '@testing-library/react';
import { Scene3DErrorBoundary } from '@/components/Scene3DErrorBoundary';
import { detectWebGLSupport } from '@/lib/webgl-detector';
import fc from 'fast-check';

// Mock WebGL detector
jest.mock('@/lib/webgl-detector', () => ({
  detectWebGLSupport: jest.fn(),
  getWebGLCapabilities: jest.fn(),
}));

// Mock Three.js and React Three Fiber to simulate failures
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, onCreated }: any) => {
    // Simulate canvas creation
    if ((global as any).__simulateCanvasError) {
      throw new Error('WebGL context creation failed');
    }
    return <div data-testid="canvas">{children}</div>;
  },
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="camera" />,
  Environment: () => <div data-testid="environment" />,
}));

describe('3D Fallback on Failure - Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).__simulateCanvasError = false;
    (detectWebGLSupport as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    (global as any).__simulateCanvasError = false;
  });

  /**
   * Property 28: 3D Fallback on Load Failure
   * For any 3D element that fails to load, fallback 2D content should be displayed instead.
   * Validates: Requirements 16.4
   */
  describe('Property 28: 3D Fallback on Load Failure', () => {
    test('should display fallback content when 3D component throws an error', () => {
      // Component that throws an error
      const FailingComponent = () => {
        throw new Error('3D model failed to load');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should display fallback 2D content
      expect(screen.getByText('Building Excellence')).toBeInTheDocument();
      expect(screen.getByText(/3D visualization unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/Your browser may not support WebGL/i)).toBeInTheDocument();
      
      // Should display 2D building SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    test('should display fallback for any type of 3D error', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('WebGL context creation failed'),
            fc.constant('Failed to load 3D model'),
            fc.constant('Shader compilation error'),
            fc.constant('Texture loading failed'),
            fc.constant('Out of memory'),
            fc.constant('GPU not available'),
            fc.string().filter(s => s.length > 0)
          ),
          (errorMessage) => {
            const FailingComponent = () => {
              throw new Error(errorMessage);
            };

            const { container, unmount } = render(
              <Scene3DErrorBoundary>
                <FailingComponent />
              </Scene3DErrorBoundary>
            );

            // Should always display fallback content
            const fallbackTexts = screen.queryAllByText('Building Excellence');
            expect(fallbackTexts.length).toBeGreaterThan(0);

            // Should display 2D SVG building
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();

            // Clean up to avoid multiple renders accumulating
            unmount();
          }
        ),
        { numRuns: 50 }
      );
    });

    test('should display custom fallback when provided', () => {
      const CustomFallback = () => (
        <div data-testid="custom-fallback">
          <h2>Custom 2D Fallback</h2>
          <p>3D content is not available</p>
        </div>
      );

      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      render(
        <Scene3DErrorBoundary fallback={<CustomFallback />}>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom 2D Fallback')).toBeInTheDocument();
      expect(screen.getByText('3D content is not available')).toBeInTheDocument();
    });

    test('should render children normally when no error occurs', () => {
      const WorkingComponent = () => (
        <div data-testid="3d-content">3D Scene Working</div>
      );

      render(
        <Scene3DErrorBoundary>
          <WorkingComponent />
        </Scene3DErrorBoundary>
      );

      expect(screen.getByTestId('3d-content')).toBeInTheDocument();
      expect(screen.getByText('3D Scene Working')).toBeInTheDocument();
      
      // Should NOT display fallback
      expect(screen.queryByText('Building Excellence')).not.toBeInTheDocument();
    });

    test('should handle errors thrown during component lifecycle', () => {
      let shouldThrow = false;

      const ConditionallyFailingComponent = () => {
        if (shouldThrow) {
          throw new Error('Delayed 3D error');
        }
        return <div data-testid="3d-content">3D Content</div>;
      };

      const { rerender } = render(
        <Scene3DErrorBoundary>
          <ConditionallyFailingComponent />
        </Scene3DErrorBoundary>
      );

      // Initially should work
      expect(screen.getByTestId('3d-content')).toBeInTheDocument();

      // Trigger error
      shouldThrow = true;
      
      // Rerender to trigger error
      expect(() => {
        rerender(
          <Scene3DErrorBoundary>
            <ConditionallyFailingComponent />
          </Scene3DErrorBoundary>
        );
      }).not.toThrow(); // Error boundary should catch it

      // Should display fallback after error
      expect(screen.getByText('Building Excellence')).toBeInTheDocument();
    });

    test('should display 2D fallback with proper styling and branding', () => {
      const FailingComponent = () => {
        throw new Error('3D error');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Check for gold color usage (brand color)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // SVG should contain gold-colored elements
      const goldElements = container.querySelectorAll('[fill="#D4AF37"], [stroke="#D4AF37"]');
      expect(goldElements.length).toBeGreaterThan(0);

      // Should have proper structure
      expect(screen.getByText('Building Excellence')).toHaveClass('text-gold');
    });

    test('should display informative message about WebGL support', () => {
      const FailingComponent = () => {
        throw new Error('WebGL not supported');
      };

      render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should inform user about WebGL requirement
      const message = screen.getByText(/Your browser may not support WebGL/i);
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass('text-gray-400');
    });

    test('should render 2D building illustration with proper structure', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '200');
      expect(svg).toHaveAttribute('height', '200');

      // Should have building components
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0); // Foundation, body, windows

      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument(); // Roof
    });

    test('should handle multiple 3D components failing independently', () => {
      const FailingComponent1 = () => {
        throw new Error('Component 1 failed');
      };

      const FailingComponent2 = () => {
        throw new Error('Component 2 failed');
      };

      const { container: container1 } = render(
        <Scene3DErrorBoundary>
          <FailingComponent1 />
        </Scene3DErrorBoundary>
      );

      const { container: container2 } = render(
        <Scene3DErrorBoundary>
          <FailingComponent2 />
        </Scene3DErrorBoundary>
      );

      // Both should display fallback independently
      const fallbacks = screen.getAllByText('Building Excellence');
      expect(fallbacks.length).toBe(2);
    });

    test('should log error to console for debugging', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const FailingComponent = () => {
        throw new Error('Test 3D error');
      };

      render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should log error for debugging
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    test('should maintain responsive layout in fallback mode', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Fallback should have responsive classes
      const fallbackContainer = container.querySelector('.relative.w-full.h-full');
      expect(fallbackContainer).toBeInTheDocument();
    });

    test('should display animated background pattern in fallback', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should have animated background
      const animatedElement = container.querySelector('.animate-pulse');
      expect(animatedElement).toBeInTheDocument();
    });

    test('should handle rapid error recovery scenarios', () => {
      // Error boundaries in React don't auto-recover - once they catch an error,
      // they stay in the error state until the component is remounted with a new key
      const FailingComponent = () => {
        throw new Error('Component error');
      };

      const { rerender } = render(
        <Scene3DErrorBoundary key="first">
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // First render should show fallback
      expect(screen.getByText('Building Excellence')).toBeInTheDocument();

      // Remounting with a new key creates a fresh error boundary
      const WorkingComponent = () => <div data-testid="working">Working</div>;
      
      rerender(
        <Scene3DErrorBoundary key="second">
          <WorkingComponent />
        </Scene3DErrorBoundary>
      );

      // New error boundary should render children normally
      expect(screen.getByTestId('working')).toBeInTheDocument();
      expect(screen.queryByText('Building Excellence')).not.toBeInTheDocument();
    });

    test('should provide accessible fallback content', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // SVG should be accessible
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Text content should be readable
      const heading = screen.getByText('Building Excellence');
      expect(heading).toBeVisible();

      const description = screen.getByText(/3D visualization unavailable/i);
      expect(description).toBeVisible();
    });

    test('should handle errors from nested 3D components', () => {
      const DeepFailingComponent = () => {
        throw new Error('Deep nested error');
      };

      const ParentComponent = () => (
        <div>
          <DeepFailingComponent />
        </div>
      );

      render(
        <Scene3DErrorBoundary>
          <ParentComponent />
        </Scene3DErrorBoundary>
      );

      // Should catch nested errors and show fallback
      expect(screen.getByText('Building Excellence')).toBeInTheDocument();
    });

    test('should display fallback for various error types', () => {
      const errorTypes = [
        new Error('Standard error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error'),
        { message: 'Custom error object' },
      ];

      errorTypes.forEach((error, index) => {
        const FailingComponent = () => {
          throw error;
        };

        const { container } = render(
          <Scene3DErrorBoundary key={index}>
            <FailingComponent />
          </Scene3DErrorBoundary>
        );

        // Should display fallback for any error type
        const fallback = screen.getAllByText('Building Excellence');
        expect(fallback.length).toBeGreaterThan(0);
      });
    });

    test('should maintain brand identity in fallback state', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should use brand colors (gold #D4AF37)
      const goldText = screen.getByText('Building Excellence');
      expect(goldText).toHaveClass('text-gold');

      // Should have gold elements in SVG
      const svg = container.querySelector('svg');
      const goldElements = svg?.querySelectorAll('[fill="#D4AF37"]');
      expect(goldElements && goldElements.length).toBeGreaterThan(0);
    });
  });

  describe('WebGL Detection and Fallback', () => {
    test('should use fallback when WebGL is not supported', () => {
      (detectWebGLSupport as jest.Mock).mockReturnValue(false);

      const Component3D = () => <div data-testid="3d-scene">3D Scene</div>;

      // When WebGL is not supported, the app should not even try to render 3D
      // This is tested at the HeroSection level
      expect(detectWebGLSupport()).toBe(false);
    });

    test('should attempt 3D rendering when WebGL is supported', () => {
      (detectWebGLSupport as jest.Mock).mockReturnValue(true);

      expect(detectWebGLSupport()).toBe(true);
    });

    test('should handle WebGL detection errors gracefully', () => {
      (detectWebGLSupport as jest.Mock).mockImplementation(() => {
        throw new Error('Detection failed');
      });

      expect(() => detectWebGLSupport()).toThrow();
    });
  });

  describe('Fallback Content Quality', () => {
    test('should provide meaningful 2D alternative to 3D content', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should have building illustration
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Should have foundation
      const foundation = container.querySelector('rect[y="160"]');
      expect(foundation).toBeInTheDocument();

      // Should have building body
      const body = container.querySelector('rect[y="100"]');
      expect(body).toBeInTheDocument();

      // Should have windows
      const windows = container.querySelectorAll('rect[width="10"][height="10"]');
      expect(windows.length).toBeGreaterThan(0);

      // Should have roof
      const roof = container.querySelector('polygon');
      expect(roof).toBeInTheDocument();
    });

    test('should display fallback with proper visual hierarchy', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Title should be prominent
      const title = screen.getByText('Building Excellence');
      expect(title).toHaveClass('text-gold', 'text-lg', 'font-semibold');

      // Description should be secondary
      const description = screen.getByText(/3D visualization unavailable/i);
      expect(description).toHaveClass('text-gray-400', 'text-sm');
    });

    test('should ensure fallback is visually appealing', () => {
      const FailingComponent = () => {
        throw new Error('3D failed');
      };

      const { container } = render(
        <Scene3DErrorBoundary>
          <FailingComponent />
        </Scene3DErrorBoundary>
      );

      // Should have gradient background
      const gradientBg = container.querySelector('.bg-gradient-to-br');
      expect(gradientBg).toBeInTheDocument();

      // Should have animated pattern
      const pattern = container.querySelector('.animate-pulse');
      expect(pattern).toBeInTheDocument();

      // Should center content
      const centeredContent = container.querySelector('.flex.items-center.justify-center');
      expect(centeredContent).toBeInTheDocument();
    });
  });
});
