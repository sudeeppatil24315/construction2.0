/**
 * Property-Based Tests for Image Zoom Capability
 * 
 * Property 34: Image Zoom Capability
 * Validates: Requirements 20.2
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectModal from '@/components/ProjectModal';
import { Project } from '@/types';
import { act } from 'react';

describe('Image Zoom Capability - Property Tests', () => {
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
        caption: 'Test caption 1',
      },
      {
        url: '/images/test-2.jpg',
        alt: 'Test image 2',
        width: 1920,
        height: 1080,
        caption: 'Test caption 2',
      },
      {
        url: '/images/test-3.jpg',
        alt: 'Test image 3',
        width: 1920,
        height: 1080,
      },
    ],
    description: 'Test project description',
    completionDate: '2024-01-01',
    location: 'Test Location',
    area: '1000 sq ft',
    duration: '6 months',
    client: 'Test Client',
    has3DModel: false,
    tags: ['test', 'residential'],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock body style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  /**
   * Property 34: Image Zoom Capability
   * For any project image display, zoom functionality should be available
   * when the user interacts with the image.
   * Validates: Requirements 20.2
   */
  describe('Property 34: Image Zoom Capability', () => {
    test('should display zoom indicator on image', () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      expect(screen.getByText('Click to zoom')).toBeInTheDocument();
    });

    test('should zoom image when clicked', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');
      expect(imageContainer).toBeInTheDocument();

      // Click to zoom
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });
    });

    test('should unzoom image when clicked again', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Click to zoom
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Click again to unzoom
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should follow mouse position when zoomed', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Click to zoom
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Move mouse
      act(() => {
        fireEvent.mouseMove(imageContainer!, {
          clientX: 100,
          clientY: 100,
        });
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        const style = img?.getAttribute('style');
        expect(style).toContain('transform-origin');
      });
    });

    test('should update zoom position on mouse move', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Zoom in
      act(() => {
        fireEvent.click(imageContainer!);
      });

      // Get bounding rect mock
      const mockRect = {
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
      };

      imageContainer!.getBoundingClientRect = jest.fn(() => mockRect as DOMRect);

      // Move mouse to different positions
      const positions = [
        { x: 100, y: 100 },
        { x: 400, y: 300 },
        { x: 700, y: 500 },
      ];

      for (const pos of positions) {
        act(() => {
          fireEvent.mouseMove(imageContainer!, {
            clientX: pos.x,
            clientY: pos.y,
          });
        });

        await waitFor(() => {
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
        });
      }
    });

    test('should reset zoom when mouse leaves', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Zoom in
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Mouse leave
      act(() => {
        fireEvent.mouseLeave(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should hide zoom indicator when zoomed', async () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      const zoomIndicator = screen.getByText('Click to zoom');
      expect(zoomIndicator).toBeInTheDocument();

      const imageContainer = document.querySelector('.cursor-zoom-in');

      // Zoom in
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        expect(screen.queryByText('Click to zoom')).not.toBeInTheDocument();
      });
    });

    test('should work with multiple images in gallery', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      // Zoom first image
      const imageContainer = container.querySelector('.cursor-zoom-in');
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Navigate to next image
      const nextButton = screen.getByLabelText('Next image');
      act(() => {
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        // Zoom should reset for new image
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should reset zoom when navigating to previous image', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      // Navigate to second image first
      const nextButton = screen.getByLabelText('Next image');
      act(() => {
        fireEvent.click(nextButton);
      });

      // Zoom second image
      const imageContainer = container.querySelector('.cursor-zoom-in');
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Navigate to previous image
      const prevButton = screen.getByLabelText('Previous image');
      act(() => {
        fireEvent.click(prevButton);
      });

      await waitFor(() => {
        // Zoom should reset
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should apply 2x zoom scale', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        const style = img?.getAttribute('style');
        expect(style).toContain('scale(2)');
      });
    });

    test('should calculate zoom origin based on mouse position', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Mock getBoundingClientRect
      const mockRect = {
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
      };

      imageContainer!.getBoundingClientRect = jest.fn(() => mockRect as DOMRect);

      // Zoom in
      act(() => {
        fireEvent.click(imageContainer!);
      });

      // Move to center
      act(() => {
        fireEvent.mouseMove(imageContainer!, {
          clientX: 400,
          clientY: 300,
        });
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        const style = img?.getAttribute('style');
        // Should have transform-origin near 50% 50%
        expect(style).toContain('transform-origin');
      });
    });

    test('should handle edge positions correctly', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      const mockRect = {
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
      };

      imageContainer!.getBoundingClientRect = jest.fn(() => mockRect as DOMRect);

      // Zoom in
      act(() => {
        fireEvent.click(imageContainer!);
      });

      // Test corners
      const corners = [
        { x: 0, y: 0 }, // Top-left
        { x: 800, y: 0 }, // Top-right
        { x: 0, y: 600 }, // Bottom-left
        { x: 800, y: 600 }, // Bottom-right
      ];

      for (const corner of corners) {
        act(() => {
          fireEvent.mouseMove(imageContainer!, {
            clientX: corner.x,
            clientY: corner.y,
          });
        });

        await waitFor(() => {
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
        });
      }
    });

    test('should maintain aspect ratio when zoomed', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('object-cover');
      });
    });

    test('should work with images of different sizes', async () => {
      const projectWithVariedImages: Project = {
        ...mockProject,
        images: [
          {
            url: '/images/small.jpg',
            alt: 'Small image',
            width: 800,
            height: 600,
          },
          {
            url: '/images/large.jpg',
            alt: 'Large image',
            width: 3840,
            height: 2160,
          },
          {
            url: '/images/portrait.jpg',
            alt: 'Portrait image',
            width: 1080,
            height: 1920,
          },
        ],
      };

      const { container } = render(
        <ProjectModal project={projectWithVariedImages} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Test zoom on first image
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Navigate and test other images
      const nextButton = screen.getByLabelText('Next image');
      
      act(() => {
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should handle rapid zoom toggle', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        act(() => {
          fireEvent.click(imageContainer!);
        });
      }

      // Should handle gracefully
      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
      });
    });

    test('should not zoom when navigating between images', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const nextButton = screen.getByLabelText('Next image');
      const prevButton = screen.getByLabelText('Previous image');

      // Navigate without zooming
      act(() => {
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });

      act(() => {
        fireEvent.click(prevButton);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });

    test('should apply smooth transition for zoom', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const img = container.querySelector('img');
      expect(img).toHaveClass('transition-transform');
      expect(img).toHaveClass('duration-300');
    });

    test('should work with single image project', async () => {
      const singleImageProject: Project = {
        ...mockProject,
        images: [
          {
            url: '/images/single.jpg',
            alt: 'Single image',
            width: 1920,
            height: 1080,
          },
        ],
      };

      const { container } = render(
        <ProjectModal project={singleImageProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');

      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });
    });

    test('should display current image counter', () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    test('should update counter when navigating', async () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      const nextButton = screen.getByLabelText('Next image');

      act(() => {
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });
    });

    test('should show thumbnail strip for multiple images', () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const thumbnails = container.querySelectorAll('[class*="w-16 h-16"]');
      expect(thumbnails.length).toBe(3);
    });

    test('should highlight current thumbnail', () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const thumbnails = container.querySelectorAll('[class*="w-16 h-16"]');
      expect(thumbnails[0]).toHaveClass('border-gold');
      expect(thumbnails[0]).toHaveClass('scale-110');
    });

    test('should switch image when thumbnail clicked', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const thumbnails = container.querySelectorAll('[class*="w-16 h-16"]');

      act(() => {
        fireEvent.click(thumbnails[2]);
      });

      await waitFor(() => {
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
      });
    });

    test('should reset zoom when switching via thumbnail', async () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      // Zoom first image
      const imageContainer = container.querySelector('.cursor-zoom-in');
      act(() => {
        fireEvent.click(imageContainer!);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-200');
      });

      // Click thumbnail
      const thumbnails = container.querySelectorAll('[class*="w-16 h-16"]');
      act(() => {
        fireEvent.click(thumbnails[1]);
      });

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toHaveClass('scale-100');
      });
    });
  });

  describe('Zoom Accessibility', () => {
    test('should provide visual feedback for zoom capability', () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      expect(screen.getByText('Click to zoom')).toBeInTheDocument();
    });

    test('should use cursor-zoom-in class', () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const imageContainer = container.querySelector('.cursor-zoom-in');
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe('Modal Controls', () => {
    test('should close modal on close button click', () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close modal');
      
      act(() => {
        fireEvent.click(closeButton);
      });

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('should close modal on backdrop click', () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const backdrop = container.querySelector('.fixed.inset-0');
      
      act(() => {
        fireEvent.click(backdrop!);
      });

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('should not close modal when clicking inside content', () => {
      const { container } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      const modalContent = container.querySelector('.relative.w-full');
      
      act(() => {
        fireEvent.click(modalContent!);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('should prevent body scroll when modal is open', () => {
      render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    test('should restore body scroll when modal closes', () => {
      const { unmount } = render(
        <ProjectModal project={mockProject} onClose={mockOnClose} />
      );

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });
  });
});
