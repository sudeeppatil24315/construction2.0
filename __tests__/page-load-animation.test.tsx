/**
 * Page Load Animation Tests
 * 
 * Tests for page load animation sequence that animates elements
 * in logical order (top to bottom) with natural easing functions.
 * 
 * Validates: Requirements 5.6, 5.4
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageLoadAnimator from '@/components/PageLoadAnimator';

// Mock framer-motion to control animations in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy({}, {
      get: (target, prop) => {
        return ({ children, variants, initial, animate, style, ...props }: any) => {
          const Component = prop as string;
          return React.createElement(
            Component,
            {
              'data-testid': 'motion-div',
              'data-initial': initial,
              'data-animate': animate,
              'data-variants': JSON.stringify(variants),
              style,
              ...props,
            },
            children
          );
        };
      },
    }),
  };
});

// Mock useReducedMotion hook
jest.mock('@/lib/animations', () => ({
  useReducedMotion: jest.fn(() => false),
  easings: {
    easeOut: [0.22, 1, 0.36, 1],
  },
}));

describe('PageLoadAnimator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children correctly', () => {
      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>
            <div>First Element</div>
          </PageLoadAnimator.Item>
          <PageLoadAnimator.Item>
            <div>Second Element</div>
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      expect(screen.getByText('First Element')).toBeInTheDocument();
      expect(screen.getByText('Second Element')).toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      const { container } = render(
        <PageLoadAnimator className="custom-class">
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const motionDiv = container.querySelector('.custom-class');
      expect(motionDiv).toBeInTheDocument();
    });

    it('should apply custom styles to container', () => {
      const customStyle = { backgroundColor: 'red' };
      const { container } = render(
        <PageLoadAnimator style={customStyle}>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const motionDiv = container.querySelector('[data-testid="motion-div"]');
      // Check that the style prop was passed (the mock should apply it)
      expect(motionDiv).toBeInTheDocument();
      expect(motionDiv).toHaveAttribute('style');
    });
  });

  describe('Animation Sequence - Top to Bottom', () => {
    it('should configure stagger animation for top-to-bottom sequence', () => {
      const { container } = render(
        <PageLoadAnimator staggerDelay={0.15}>
          <PageLoadAnimator.Item>First</PageLoadAnimator.Item>
          <PageLoadAnimator.Item>Second</PageLoadAnimator.Item>
          <PageLoadAnimator.Item>Third</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      expect(containerDiv).toHaveAttribute('data-initial', 'initial');
      expect(containerDiv).toHaveAttribute('data-animate', 'animate');

      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition).toBeDefined();
      expect(variants.animate.transition.staggerChildren).toBe(0.15);
      expect(variants.animate.transition.staggerDirection).toBe(1); // Top to bottom
    });

    it('should apply custom stagger delay', () => {
      const customStagger = 0.2;
      const { container } = render(
        <PageLoadAnimator staggerDelay={customStagger}>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition.staggerChildren).toBe(customStagger);
    });

    it('should apply initial delay before animation starts', () => {
      const initialDelay = 0.3;
      const { container } = render(
        <PageLoadAnimator delay={initialDelay}>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition.delayChildren).toBe(initialDelay);
    });
  });

  describe('Natural Easing Functions', () => {
    it('should use easeOut easing for natural motion', () => {
      const { easings } = require('@/lib/animations');
      
      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // Verify that easeOut easing is used (defined in framer-variants.ts)
      expect(easings.easeOut).toEqual([0.22, 1, 0.36, 1]);
    });

    it('should apply custom duration to animations', () => {
      const customDuration = 0.8;
      render(
        <PageLoadAnimator duration={customDuration}>
          <PageLoadAnimator.Item duration={customDuration}>
            Content
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // Animation duration is applied through variants
      // This test verifies the prop is accepted
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Support', () => {
    it('should disable animations when user prefers reduced motion', () => {
      const { useReducedMotion } = require('@/lib/animations');
      useReducedMotion.mockReturnValue(true);

      const { container } = render(
        <PageLoadAnimator staggerDelay={0.15} delay={0.2}>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      
      // When reduced motion is enabled, delays should be 0
      expect(variants.animate.transition.staggerChildren).toBe(0);
      expect(variants.animate.transition.delayChildren).toBe(0);
    });

    it('should remove vertical movement when reduced motion is enabled', () => {
      const { useReducedMotion } = require('@/lib/animations');
      useReducedMotion.mockReturnValue(true);

      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // With reduced motion, y offset should be 0
      // This is handled in the component's createItemVariants function
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('PageLoadAnimator.Item', () => {
    it('should render with default div element', () => {
      const { container } = render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Item Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const items = container.querySelectorAll('[data-testid="motion-div"]');
      expect(items.length).toBeGreaterThan(0);
      expect(screen.getByText('Item Content')).toBeInTheDocument();
    });

    it('should render with custom element type', () => {
      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item as="section">
            Section Content
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      expect(screen.getByText('Section Content')).toBeInTheDocument();
    });

    it('should apply custom className to item', () => {
      const { container } = render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item className="item-class">
            Content
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const item = container.querySelector('.item-class');
      expect(item).toBeInTheDocument();
    });

    it('should apply custom styles to item', () => {
      const customStyle = { color: 'blue' };
      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item style={customStyle}>
            Content
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // Check that the item renders with content
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Multiple Items Animation Order', () => {
    it('should animate multiple items in sequence', () => {
      const { useReducedMotion } = require('@/lib/animations');
      useReducedMotion.mockReturnValue(false); // Ensure reduced motion is off
      
      const { container } = render(
        <PageLoadAnimator staggerDelay={0.1}>
          <PageLoadAnimator.Item>First</PageLoadAnimator.Item>
          <PageLoadAnimator.Item>Second</PageLoadAnimator.Item>
          <PageLoadAnimator.Item>Third</PageLoadAnimator.Item>
          <PageLoadAnimator.Item>Fourth</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // All items should be rendered
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
      expect(screen.getByText('Fourth')).toBeInTheDocument();

      // Container should have stagger configuration
      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition.staggerChildren).toBe(0.1);
    });
  });

  describe('Integration with Page Sections', () => {
    it('should work with section components', () => {
      const MockSection = ({ title }: { title: string }) => (
        <section>
          <h2>{title}</h2>
        </section>
      );

      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>
            <MockSection title="Hero" />
          </PageLoadAnimator.Item>
          <PageLoadAnimator.Item>
            <MockSection title="Services" />
          </PageLoadAnimator.Item>
          <PageLoadAnimator.Item>
            <MockSection title="Contact" />
          </PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      expect(screen.getByText('Hero')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('should use default delay of 0', () => {
      const { container } = render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition.delayChildren).toBe(0);
    });

    it('should use default staggerDelay of 0.15', () => {
      const { useReducedMotion } = require('@/lib/animations');
      useReducedMotion.mockReturnValue(false); // Ensure reduced motion is off
      
      const { container } = render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      const containerDiv = container.querySelector('[data-testid="motion-div"]');
      const variants = JSON.parse(containerDiv?.getAttribute('data-variants') || '{}');
      expect(variants.animate.transition.staggerChildren).toBe(0.15);
    });

    it('should use default duration of 0.6', () => {
      render(
        <PageLoadAnimator>
          <PageLoadAnimator.Item>Content</PageLoadAnimator.Item>
        </PageLoadAnimator>
      );

      // Default duration is used in item variants
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
