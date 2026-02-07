/**
 * Property-Based Tests for Image Lazy Loading
 * 
 * Property 25: Image Lazy Loading
 * Validates: Requirements 6.5, 9.4
 */

import { render, screen, waitFor } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Image Lazy Loading - Property Tests', () => {
  const mockProject: Project = {
    id: 'test-project',
    title: 'Test Project',
    category: 'residential',
    thumbnail: {
      url: '/images/test-thumb.jpg',
      alt: 'Test project thumbnail',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/test-1.jpg',
        alt: 'Test image 1',
        width: 1920,
        height: 1080,
      },
    ],
    description: 'Test project description',
    completionDate: '2024-01-01',
    location: 'Test Location',
    has3DModel: false,
    tags: ['test'],
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  /**
   * Property 25: Image Lazy Loading
   * For any image element that is below the fold (not in initial viewport),
   * the image should not load until it approaches the viewport.
   * Validates: Requirements 6.5, 9.4
   */
  describe('Property 25: Image Lazy Loading', () => {
    test('should set up IntersectionObserver for lazy loading', () => {
      render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

      // IntersectionObserver should be created
      expect(mockIntersectionObserver).toHaveBeenCalled();
      
      // Check that observe was called
      const observeCall = mockIntersectionObserver.mock.results[0].value.observe;
      expect(observeCall).toHaveBeenCalled();
    });

    test('should not load image immediately when not in viewport', () => {
      // Mock IntersectionObserver to not trigger intersection
      const mockObserve = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Image should not be rendered yet (lazy loading)
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);
    });

    test('should load image when element enters viewport', async () => {
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Simulate intersection
      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        const images = container.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    test('should use loading="lazy" attribute on images', async () => {
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Trigger intersection
      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    test('should unobserve element after it becomes visible', async () => {
      const mockUnobserve = jest.fn();
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: mockUnobserve,
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Trigger intersection
      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        expect(mockUnobserve).toHaveBeenCalled();
      });
    });

    test('should use appropriate rootMargin for early loading', () => {
      render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

      const observerOptions = mockIntersectionObserver.mock.calls[0][1];
      
      // Should have rootMargin to load images before they enter viewport
      expect(observerOptions).toHaveProperty('rootMargin');
      expect(observerOptions.rootMargin).toBeTruthy();
    });

    test('should handle multiple images with lazy loading', async () => {
      const projectWithMultipleImages: Project = {
        ...mockProject,
        images: [
          {
            url: '/images/test-1.jpg',
            alt: 'Test image 1',
            width: 1920,
            height: 1080,
          },
          {
            url: '/images/test-2.jpg',
            alt: 'Test image 2',
            width: 1920,
            height: 1080,
          },
          {
            url: '/images/test-3.jpg',
            alt: 'Test image 3',
            width: 1920,
            height: 1080,
          },
        ],
      };

      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={projectWithMultipleImages} onClick={mockOnClick} />
      );

      // Trigger intersection
      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    test('should show loading placeholder before image loads', async () => {
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Trigger intersection
      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        // Should show loading spinner
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });

    test('should handle intersection threshold correctly', () => {
      render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

      const observerOptions = mockIntersectionObserver.mock.calls[0][1];
      
      // Should have threshold for when to trigger loading
      expect(observerOptions).toHaveProperty('threshold');
      expect(typeof observerOptions.threshold).toBe('number');
    });

    test('should clean up observer on unmount', () => {
      const mockDisconnect = jest.fn();
      const mockUnobserve = jest.fn();
      
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      });

      const { unmount } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      unmount();

      // Should clean up observer
      expect(mockUnobserve).toHaveBeenCalled();
    });

    test('should not load images for projects not in viewport', () => {
      // Render multiple project cards
      const projects = Array.from({ length: 10 }, (_, i) => ({
        ...mockProject,
        id: `project-${i}`,
        title: `Project ${i}`,
      }));

      const { container } = render(
        <div>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={mockOnClick} />
          ))}
        </div>
      );

      // Without intersection, no images should be loaded
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);
    });

    test('should progressively load images as user scrolls', async () => {
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const projects = Array.from({ length: 3 }, (_, i) => ({
        ...mockProject,
        id: `project-${i}`,
        title: `Project ${i}`,
      }));

      const { container } = render(
        <div>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={mockOnClick} />
          ))}
        </div>
      );

      // Initially no images
      expect(container.querySelectorAll('img').length).toBe(0);

      // Simulate first card entering viewport
      const cards = container.querySelectorAll('[class*="group"]');
      const mockEntry1 = {
        isIntersecting: true,
        target: cards[0],
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry1], {} as IntersectionObserver);

      await waitFor(() => {
        const images = container.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    test('should handle rapid scroll with multiple intersections', async () => {
      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Simulate rapid intersection changes
      const mockEntries = [
        { isIntersecting: true, target: container.firstChild },
        { isIntersecting: false, target: container.firstChild },
        { isIntersecting: true, target: container.firstChild },
      ] as IntersectionObserverEntry[];

      intersectionCallback!(mockEntries, {} as IntersectionObserver);

      await waitFor(() => {
        // Should handle rapid changes gracefully
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
      });
    });

    test('should optimize performance by loading images only when needed', () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      // Before intersection, no image requests should be made
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);

      // This ensures bandwidth is saved for below-the-fold images
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    test('should support different viewport sizes for lazy loading', () => {
      // Test with different viewport configurations
      const viewportConfigs = [
        { width: 320, height: 568 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];

      viewportConfigs.forEach((viewport) => {
        // Mock viewport size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        });

        render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

        // IntersectionObserver should be set up regardless of viewport
        expect(mockIntersectionObserver).toHaveBeenCalled();
      });
    });
  });

  describe('Lazy Loading Performance', () => {
    test('should reduce initial page load by deferring image loading', () => {
      const startTime = performance.now();
      
      render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should be fast since images aren't loaded yet
      expect(renderTime).toBeLessThan(100); // milliseconds
    });

    test('should handle large numbers of images efficiently', () => {
      const manyProjects = Array.from({ length: 50 }, (_, i) => ({
        ...mockProject,
        id: `project-${i}`,
      }));

      const { container } = render(
        <div>
          {manyProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={mockOnClick} />
          ))}
        </div>
      );

      // No images should be loaded initially
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);

      // IntersectionObserver should be set up for each card
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(50);
    });
  });

  describe('Lazy Loading Edge Cases', () => {
    test('should handle missing image URLs gracefully', async () => {
      const projectWithMissingImage: Project = {
        ...mockProject,
        thumbnail: {
          url: '',
          alt: 'Missing image',
          width: 800,
          height: 600,
        },
      };

      let intersectionCallback: IntersectionObserverCallback;
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const { container } = render(
        <ProjectCard project={projectWithMissingImage} onClick={mockOnClick} />
      );

      const mockEntry = {
        isIntersecting: true,
        target: container.firstChild,
      } as IntersectionObserverEntry;

      intersectionCallback!([mockEntry], {} as IntersectionObserver);

      await waitFor(() => {
        // Should still render without crashing
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    test('should handle observer not supported gracefully', () => {
      // Temporarily remove IntersectionObserver
      const originalIO = window.IntersectionObserver;
      (window as any).IntersectionObserver = undefined;

      expect(() => {
        render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
      }).not.toThrow();

      // Restore
      window.IntersectionObserver = originalIO;
    });
  });
});
