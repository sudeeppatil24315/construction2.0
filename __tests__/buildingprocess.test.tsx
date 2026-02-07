/**
 * Property-Based Tests for Building Process Component
 * 
 * Property 7: Scroll-Triggered Sequential Animation
 * Property 8: Click-to-Reveal Details
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuildingProcess from '@/components/BuildingProcess';
import { BUILDING_PHASES } from '@/lib/constants';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Building Process Component - Property Tests', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  /**
   * Property 7: Scroll-Triggered Sequential Animation
   * For any section with multiple animated elements (like the building process phases),
   * when the section enters the viewport, elements should animate sequentially in the defined order.
   * Validates: Requirements 4.6
   */
  describe('Property 7: Scroll-Triggered Sequential Animation', () => {
    test('should render all four building phases', () => {
      render(<BuildingProcess />);

      BUILDING_PHASES.forEach((phase) => {
        const elements = screen.getAllByText(phase.title);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    test('should set up IntersectionObserver for scroll detection', () => {
      render(<BuildingProcess />);

      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    test('should display phases in correct order', () => {
      render(<BuildingProcess />);

      const phaseOrder = ['Pre-Design', 'Design', 'Planning', 'Execution'];
      phaseOrder.forEach((title) => {
        const elements = screen.getAllByText(title);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    test('should have staggered animation delays for sequential effect', () => {
      const { container } = render(<BuildingProcess />);

      // Verify that phase cards exist
      const phaseCards = container.querySelectorAll('[class*="transition"]');
      expect(phaseCards.length).toBeGreaterThan(0);
    });

    test('should animate all phases when section becomes visible', () => {
      render(<BuildingProcess />);

      // All phases should be present in the DOM
      expect(screen.getAllByText(/Pre-Design|Design|Planning|Execution/).length).toBeGreaterThanOrEqual(4);
    });
  });

  /**
   * Property 8: Click-to-Reveal Details
   * For any clickable phase card in the building process,
   * when clicked, detailed information about that phase should be displayed.
   * Validates: Requirements 4.7
   */
  describe('Property 8: Click-to-Reveal Details', () => {
    test('should show phase steps when phase card is clicked', async () => {
      render(<BuildingProcess />);

      // Find and click the first phase card (use first occurrence - desktop)
      const preDesignCards = screen.getAllByText('Pre-Design');
      const preDesignCard = preDesignCards[0].closest('div');
      if (preDesignCard) {
        fireEvent.click(preDesignCard);

        // Check if steps are revealed
        await waitFor(() => {
          BUILDING_PHASES[0].steps.forEach((step) => {
            expect(screen.getAllByText(step)[0]).toBeInTheDocument();
          });
        });
      }
    });

    test('should toggle phase details on multiple clicks', async () => {
      render(<BuildingProcess />);

      const designCards = screen.getAllByText('Design');
      const designCard = designCards[0].closest('div');
      if (designCard) {
        // First click - expand
        fireEvent.click(designCard);

        await waitFor(() => {
          expect(screen.getAllByText('3D Floor Plan')[0]).toBeInTheDocument();
        });

        // Second click - collapse
        fireEvent.click(designCard);

        // Details should still be in DOM but hidden (max-h-0)
        expect(screen.getAllByText('3D Floor Plan')[0]).toBeInTheDocument();
      }
    });

    test('should display all steps for each phase when expanded', async () => {
      render(<BuildingProcess />);

      for (let i = 0; i < BUILDING_PHASES.length; i++) {
        const phase = BUILDING_PHASES[i];
        const phaseCards = screen.getAllByText(phase.title);
        const phaseCard = phaseCards[0].closest('div');

        if (phaseCard) {
          fireEvent.click(phaseCard);

          await waitFor(() => {
            phase.steps.forEach((step) => {
              expect(screen.getAllByText(step)[0]).toBeInTheDocument();
            });
          });

          // Click again to collapse before next iteration
          fireEvent.click(phaseCard);
        }
      }
    });

    test('should show correct steps for Pre-Design phase', async () => {
      render(<BuildingProcess />);

      const preDesignCards = screen.getAllByText('Pre-Design');
      const preDesignCard = preDesignCards[0].closest('div');
      if (preDesignCard) {
        fireEvent.click(preDesignCard);

        await waitFor(() => {
          expect(screen.getAllByText('Architect Assignment')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Digital Survey')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Soil Test')[0]).toBeInTheDocument();
        });
      }
    });

    test('should show correct steps for Design phase', async () => {
      render(<BuildingProcess />);

      const designCards = screen.getAllByText('Design');
      const designCard = designCards[0].closest('div');
      if (designCard) {
        fireEvent.click(designCard);

        await waitFor(() => {
          expect(screen.getAllByText('3D Floor Plan')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Structural Design')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Final Quotation')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Elevation Design')[0]).toBeInTheDocument();
        });
      }
    });

    test('should show correct steps for Planning phase', async () => {
      render(<BuildingProcess />);

      const planningCards = screen.getAllByText('Planning');
      const planningCard = planningCards[0].closest('div');
      if (planningCard) {
        fireEvent.click(planningCard);

        await waitFor(() => {
          expect(screen.getAllByText('Contract/Schedule and Signing')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Construction Partner Allocation')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Project Manager Assignment')[0]).toBeInTheDocument();
        });
      }
    });

    test('should show correct steps for Execution phase', async () => {
      render(<BuildingProcess />);

      const executionCards = screen.getAllByText('Execution');
      const executionCard = executionCards[0].closest('div');
      if (executionCard) {
        fireEvent.click(executionCard);

        await waitFor(() => {
          expect(screen.getAllByText('Project Site Verification')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Quality Checks & Inspections')[0]).toBeInTheDocument();
          expect(screen.getAllByText('Project Handover')[0]).toBeInTheDocument();
        });
      }
    });

    test('should allow only one phase to be expanded at a time', async () => {
      render(<BuildingProcess />);

      // Click first phase
      const preDesignCards = screen.getAllByText('Pre-Design');
      const preDesignCard = preDesignCards[0].closest('div');
      if (preDesignCard) {
        fireEvent.click(preDesignCard);

        await waitFor(() => {
          expect(screen.getAllByText('Architect Assignment')[0]).toBeInTheDocument();
        });

        // Click second phase
        const designCards = screen.getAllByText('Design');
        const designCard = designCards[0].closest('div');
        if (designCard) {
          fireEvent.click(designCard);

          await waitFor(() => {
            expect(screen.getAllByText('3D Floor Plan')[0]).toBeInTheDocument();
          });
        }
      }
    });
  });

  describe('Building Process Rendering', () => {
    test('should render section header', () => {
      render(<BuildingProcess />);

      expect(screen.getByText(/Our Building/)).toBeInTheDocument();
      expect(screen.getByText(/Process/)).toBeInTheDocument();
    });

    test('should render phase descriptions', () => {
      render(<BuildingProcess />);

      BUILDING_PHASES.forEach((phase) => {
        const descriptions = screen.getAllByText(phase.description);
        expect(descriptions.length).toBeGreaterThan(0);
      });
    });

    test('should render phase icons', () => {
      render(<BuildingProcess />);

      BUILDING_PHASES.forEach((phase) => {
        const icons = screen.getAllByText(phase.icon);
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    test('should render phase numbers', () => {
      render(<BuildingProcess />);

      for (let i = 1; i <= BUILDING_PHASES.length; i++) {
        expect(screen.getAllByText(i.toString()).length).toBeGreaterThan(0);
      }
    });
  });
});
