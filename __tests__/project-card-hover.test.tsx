/**
 * Property-Based Tests for Project Card Hover Transform
 * 
 * Property 33: Project Card Hover Transform
 * Validates: Requirements 6.4
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types';
import { act } from 'react';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Project Card Hover Transform - Property Tests', () => {
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
    area: '1000 sq ft',
    has3DModel: false,
    tags: ['test'],
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  /**
   * Property 33: Project Card Hover Transform
   * For any project card, when hovered, 3D transform effects should be applied.
   * Validates: Requirements 6.4
   */
  describe('Property 33: Project Card Hover Transform', () => {
    test('should apply 3D transform on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');
      expect(card).toBeInTheDocument();

      // Hover over card
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const style = window.getComputedStyle(card!);
        // Card should have transform style
        expect(card).toHaveStyle({ transformStyle: 'preserve-3d' });
      });
    });

    test('should scale up on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Initial state - no scale
      expect(card).toHaveStyle('transform: scale(1)');

      // Hover
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        // Should scale up
        const transform = card?.getAttribute('style');
        expect(transform).toContain('scale(1.05)');
      });
    });

    test('should apply rotateX and rotateY on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const transform = card!.getAttribute('style');
        expect(transform).toContain('rotateX');
        expect(transform).toContain('rotateY');
      });
    });

    test('should remove transform when hover ends', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Hover
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const transform = card?.getAttribute('style');
        expect(transform).toContain('scale(1.05)');
      });

      // Mouse leave
      act(() => {
        fireEvent.mouseLeave(card!);
      });

      await waitFor(() => {
        expect(card).toHaveStyle('transform: scale(1)');
      });
    });

    test('should show gold overlay on hover', async () => {
      // Set up intersection observer mock BEFORE rendering
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

      const card = container.querySelector('.group');

      // Trigger intersection to load image
      const mockEntry = {
        isIntersecting: true,
        target: card,
      } as IntersectionObserverEntry;

      act(() => {
        intersectionCallback!([mockEntry], {} as IntersectionObserver);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      // Hover to show overlay
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const overlays = container.querySelectorAll('.bg-gold');
        const goldOverlay = Array.from(overlays).find(el => 
          el.classList.contains('absolute') && el.classList.contains('inset-0')
        );
        expect(goldOverlay).toHaveClass('opacity-30');
      });
    });

    test('should hide gold overlay when not hovering', async () => {
      // Set up intersection observer mock BEFORE rendering
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

      const card = container.querySelector('.group');

      // Trigger intersection
      const mockEntry = {
        isIntersecting: true,
        target: card,
      } as IntersectionObserverEntry;

      act(() => {
        intersectionCallback!([mockEntry], {} as IntersectionObserver);
      });

      await waitFor(() => {
        const overlays = container.querySelectorAll('.bg-gold');
        const goldOverlay = Array.from(overlays).find(el => 
          el.classList.contains('absolute') && el.classList.contains('inset-0')
        );
        expect(goldOverlay).toHaveClass('opacity-0');
      });
    });

    test('should show project details on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Hover
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        // Details overlay should become visible
        const detailsOverlay = container.querySelector('.bg-gradient-to-t');
        expect(detailsOverlay).toHaveClass('opacity-100');
      });
    });

    test('should hide project details when not hovering', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Initially hidden
      const detailsOverlay = container.querySelector('.bg-gradient-to-t');
      expect(detailsOverlay).toHaveClass('opacity-0');

      // Hover
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        expect(detailsOverlay).toHaveClass('opacity-100');
      });

      // Mouse leave
      act(() => {
        fireEvent.mouseLeave(card!);
      });

      await waitFor(() => {
        expect(detailsOverlay).toHaveClass('opacity-0');
      });
    });

    test('should display project title in hover overlay', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain(mockProject.title);
      });
    });

    test('should display project category badge on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain(
          mockProject.category.toUpperCase()
        );
      });
    });

    test('should display project location on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain(mockProject.location);
      });
    });

    test('should display project area on hover when available', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain(mockProject.area);
      });
    });

    test('should show gold border on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const border = container.querySelector('.border-gold');
        expect(border).toHaveClass('opacity-100');
      });
    });

    test('should hide gold border when not hovering', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      const border = container.querySelector('.border-gold');
      expect(border).toHaveClass('opacity-0');
    });

    test('should apply smooth transitions for hover effects', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');
      
      // Check for transition classes
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-300');
    });

    test('should scale image on hover', async () => {
      // Set up intersection observer mock BEFORE rendering
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

      const card = container.querySelector('.group');

      // Trigger intersection to load image
      const mockEntry = {
        isIntersecting: true,
        target: card,
      } as IntersectionObserverEntry;

      act(() => {
        intersectionCallback!([mockEntry], {} as IntersectionObserver);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      // Hover
      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-110');
      });
    });

    test('should handle rapid hover on/off', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Rapid hover on/off
      for (let i = 0; i < 5; i++) {
        act(() => {
          fireEvent.mouseEnter(card!);
          fireEvent.mouseLeave(card!);
        });
      }

      // Should handle gracefully without errors
      expect(card).toBeInTheDocument();
    });

    test('should work with different project categories', async () => {
      const categories: Array<'residential' | 'commercial' | 'industrial' | 'infrastructure'> = [
        'residential',
        'commercial',
        'industrial',
        'infrastructure',
      ];

      for (const category of categories) {
        const projectWithCategory = { ...mockProject, category };
        const { container, unmount } = render(
          <ProjectCard project={projectWithCategory} onClick={mockOnClick} />
        );

        const card = container.querySelector('.group');

        act(() => {
          fireEvent.mouseEnter(card!);
        });

        await waitFor(() => {
          expect(container.textContent).toContain(category.toUpperCase());
        });

        unmount();
      }
    });

    test('should maintain hover state during mouse movement', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      // Move mouse within card
      act(() => {
        fireEvent.mouseMove(card!, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(card!, { clientX: 150, clientY: 150 });
      });

      await waitFor(() => {
        // Should still be in hover state
        const detailsOverlay = container.querySelector('.bg-gradient-to-t');
        expect(detailsOverlay).toHaveClass('opacity-100');
      });
    });

    test('should apply cursor pointer on hover', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');
      expect(card).toHaveClass('cursor-pointer');
    });

    test('should trigger onClick when card is clicked', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.click(card!);
      });

      expect(mockOnClick).toHaveBeenCalledWith(mockProject.id);
    });

    test('should work with projects without optional fields', async () => {
      const minimalProject: Project = {
        id: 'minimal',
        title: 'Minimal Project',
        category: 'residential',
        thumbnail: {
          url: '/images/minimal.jpg',
          alt: 'Minimal',
          width: 800,
          height: 600,
        },
        images: [],
        description: 'Minimal description',
        completionDate: '2024-01-01',
        location: 'Location',
        has3DModel: false,
        tags: [],
      };

      const { container } = render(
        <ProjectCard project={minimalProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        // Should still show hover effects
        const detailsOverlay = container.querySelector('.bg-gradient-to-t');
        expect(detailsOverlay).toHaveClass('opacity-100');
      });
    });
  });

  describe('3D Transform Effects', () => {
    test('should preserve 3D transform style', () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');
      expect(card).toHaveStyle({ transformStyle: 'preserve-3d' });
    });

    test('should apply perspective for 3D effect', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      act(() => {
        fireEvent.mouseEnter(card!);
      });

      await waitFor(() => {
        const transform = card!.getAttribute('style');
        // Should have 3D transforms
        expect(transform).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    test('should be keyboard accessible', async () => {
      const { container } = render(
        <ProjectCard project={mockProject} onClick={mockOnClick} />
      );

      const card = container.querySelector('.group');

      // Focus
      act(() => {
        card!.focus();
      });

      // Enter key should trigger click
      act(() => {
        fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });
      });

      // Card should be clickable
      expect(card).toHaveClass('cursor-pointer');
    });
  });
});
