/**
 * Animation System Tests
 * 
 * Tests for GSAP configuration, Framer Motion variants, and animation hooks
 */

import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/lib/animations/use-reduced-motion';
import {
  easings,
  transitions,
  fadeInUp,
  scaleIn,
  staggerContainer,
  getVariants,
  reducedMotion,
  createFadeInVariants,
  createScaleVariants,
} from '@/lib/animations/framer-variants';

describe('Animation System', () => {
  describe('Framer Motion Variants', () => {
    it('should have correct fadeInUp initial state', () => {
      expect(fadeInUp.initial).toEqual({
        opacity: 0,
        y: 60,
      });
    });

    it('should have correct fadeInUp animate state', () => {
      expect(fadeInUp.animate).toHaveProperty('opacity', 1);
      expect(fadeInUp.animate).toHaveProperty('y', 0);
      expect(fadeInUp.animate).toHaveProperty('transition');
    });

    it('should have correct scaleIn initial state', () => {
      expect(scaleIn.initial).toEqual({
        opacity: 0,
        scale: 0.8,
      });
    });

    it('should have correct scaleIn animate state', () => {
      expect(scaleIn.animate).toHaveProperty('opacity', 1);
      expect(scaleIn.animate).toHaveProperty('scale', 1);
    });

    it('should have stagger configuration in staggerContainer', () => {
      expect(staggerContainer.animate).toHaveProperty('transition');
      const transition = staggerContainer.animate?.transition as any;
      expect(transition).toHaveProperty('staggerChildren');
      expect(transition.staggerChildren).toBe(0.1);
    });
  });

  describe('Custom Easings', () => {
    it('should have easeOut easing defined', () => {
      expect(easings.easeOut).toEqual([0.22, 1, 0.36, 1]);
    });

    it('should have easeInOut easing defined', () => {
      expect(easings.easeInOut).toEqual([0.43, 0.13, 0.23, 0.96]);
    });

    it('should have spring easing defined', () => {
      expect(easings.spring).toEqual([0.68, -0.55, 0.265, 1.55]);
    });

    it('should have sharp easing defined', () => {
      expect(easings.sharp).toEqual([0.4, 0, 0.2, 1]);
    });
  });

  describe('Transitions', () => {
    it('should have default transition with correct duration', () => {
      expect(transitions.default.duration).toBe(0.6);
      expect(transitions.default.ease).toEqual(easings.easeOut);
    });

    it('should have fast transition with shorter duration', () => {
      expect(transitions.fast.duration).toBe(0.3);
    });

    it('should have slow transition with longer duration', () => {
      expect(transitions.slow.duration).toBe(1);
    });

    it('should have spring transition with correct type', () => {
      expect(transitions.spring.type).toBe('spring');
      expect(transitions.spring.stiffness).toBe(100);
      expect(transitions.spring.damping).toBe(15);
    });
  });

  describe('getVariants Helper', () => {
    it('should return original variants when reduced motion is false', () => {
      const result = getVariants(fadeInUp, false);
      expect(result).toBe(fadeInUp);
    });

    it('should return reducedMotion variants when reduced motion is true', () => {
      const result = getVariants(fadeInUp, true);
      expect(result).toBe(reducedMotion);
    });
  });

  describe('createFadeInVariants Helper', () => {
    it('should create custom fade-in variants with default values', () => {
      const variants = createFadeInVariants();
      expect(variants.initial).toEqual({
        opacity: 0,
        y: 60,
      });
      expect(variants.animate).toHaveProperty('opacity', 1);
      expect(variants.animate).toHaveProperty('y', 0);
    });

    it('should create custom fade-in variants with custom y value', () => {
      const variants = createFadeInVariants(100);
      expect(variants.initial).toEqual({
        opacity: 0,
        y: 100,
      });
    });

    it('should create custom fade-in variants with custom duration', () => {
      const variants = createFadeInVariants(60, 1.2);
      const animate = variants.animate as any;
      expect(animate.transition.duration).toBe(1.2);
    });
  });

  describe('createScaleVariants Helper', () => {
    it('should create custom scale variants with default values', () => {
      const variants = createScaleVariants();
      expect(variants.initial).toEqual({
        opacity: 0,
        scale: 0.8,
      });
      expect(variants.animate).toHaveProperty('opacity', 1);
      expect(variants.animate).toHaveProperty('scale', 1);
    });

    it('should create custom scale variants with custom initial scale', () => {
      const variants = createScaleVariants(0.5);
      expect(variants.initial).toEqual({
        opacity: 0,
        scale: 0.5,
      });
    });

    it('should create custom scale variants with custom duration', () => {
      const variants = createScaleVariants(0.8, 0.9);
      const animate = variants.animate as any;
      expect(animate.transition.duration).toBe(0.9);
    });
  });

  describe('useReducedMotion Hook', () => {
    let matchMediaMock: jest.Mock;

    beforeEach(() => {
      // Mock matchMedia
      matchMediaMock = jest.fn();
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: matchMediaMock,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return false when reduced motion is not preferred', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(false);
    });

    it('should return true when reduced motion is preferred', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(true);
    });

    it('should add event listener for media query changes', () => {
      const addEventListener = jest.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: jest.fn(),
      });

      renderHook(() => useReducedMotion());
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const removeEventListener = jest.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener,
      });

      const { unmount } = renderHook(() => useReducedMotion());
      unmount();
      expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Reduced Motion Variants', () => {
    it('should have minimal animation duration', () => {
      const animate = reducedMotion.animate as any;
      expect(animate.transition.duration).toBe(0.01);
    });

    it('should only animate opacity', () => {
      expect(reducedMotion.initial).toEqual({ opacity: 0 });
      expect(reducedMotion.animate).toHaveProperty('opacity', 1);
      // Should not have y, x, scale, etc.
      expect(reducedMotion.animate).not.toHaveProperty('y');
      expect(reducedMotion.animate).not.toHaveProperty('x');
      expect(reducedMotion.animate).not.toHaveProperty('scale');
    });
  });

  describe('Variant Structure', () => {
    const variantsToTest = [
      { name: 'fadeInUp', variant: fadeInUp },
      { name: 'scaleIn', variant: scaleIn },
    ];

    variantsToTest.forEach(({ name, variant }) => {
      it(`${name} should have initial, animate, and exit states`, () => {
        expect(variant).toHaveProperty('initial');
        expect(variant).toHaveProperty('animate');
        expect(variant).toHaveProperty('exit');
      });

      it(`${name} initial state should have opacity 0`, () => {
        expect(variant.initial).toHaveProperty('opacity', 0);
      });

      it(`${name} animate state should have opacity 1`, () => {
        expect(variant.animate).toHaveProperty('opacity', 1);
      });
    });
  });

  describe('Animation Timing', () => {
    it('should have consistent timing across variants', () => {
      const animate = fadeInUp.animate as any;
      expect(animate.transition.duration).toBe(0.6);
      expect(animate.transition.ease).toEqual(easings.easeOut);
    });

    it('should have faster exit animations', () => {
      const exit = fadeInUp.exit as any;
      expect(exit.transition.duration).toBe(0.3);
    });
  });
});
