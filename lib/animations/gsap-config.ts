/**
 * GSAP Configuration and Setup
 * 
 * This module configures GSAP with ScrollTrigger plugin and provides
 * utility functions for scroll-based animations.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Initialize GSAP with default configuration
 */
export function initGSAP() {
  if (typeof window === 'undefined') return;

  const reducedMotion = prefersReducedMotion();

  // Set default ease
  gsap.defaults({
    ease: reducedMotion ? 'none' : 'power2.out',
    duration: reducedMotion ? 0.01 : 0.6,
  });

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
    markers: false, // Set to true for debugging
  });

  // Refresh ScrollTrigger on window resize
  ScrollTrigger.refresh();
}

/**
 * Create a scroll-triggered animation
 * 
 * @param trigger - CSS selector for the trigger element
 * @param animation - GSAP animation or timeline
 * @param options - ScrollTrigger options
 */
export function createScrollAnimation(
  trigger: string | HTMLElement,
  animation: gsap.core.Animation | gsap.core.Timeline,
  options: ScrollTrigger.Vars = {}
) {
  return ScrollTrigger.create({
    trigger,
    animation,
    ...options,
  });
}

/**
 * Create a parallax scroll effect
 * 
 * @param element - CSS selector or element to animate
 * @param speed - Parallax speed (0.5 = half speed, 2 = double speed)
 * @param trigger - Optional trigger element (defaults to element itself)
 */
export function createParallax(
  element: string | HTMLElement,
  speed: number = 0.5,
  trigger?: string | HTMLElement
) {
  const reducedMotion = prefersReducedMotion();

  // Disable parallax if user prefers reduced motion
  if (reducedMotion) {
    return gsap.to(element, {
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Create a fade-in animation on scroll
 * 
 * @param element - CSS selector or element to animate
 * @param options - Additional GSAP and ScrollTrigger options
 */
export function createFadeIn(
  element: string | HTMLElement,
  options: {
    duration?: number;
    y?: number;
    delay?: number;
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
  } = {}
) {
  const {
    duration = 0.8,
    y = 60,
    delay = 0,
    trigger,
    start = 'top 80%',
    end = 'top 20%',
  } = options;

  const reducedMotion = prefersReducedMotion();

  return gsap.from(element, {
    opacity: 0,
    y: reducedMotion ? 0 : y,
    duration: reducedMotion ? 0.01 : duration,
    delay: reducedMotion ? 0 : delay,
    scrollTrigger: {
      trigger: trigger || element,
      start,
      end,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Create a staggered animation for multiple elements
 * 
 * @param elements - CSS selector or elements to animate
 * @param options - Animation and stagger options
 */
export function createStaggerAnimation(
  elements: string | HTMLElement[],
  options: {
    duration?: number;
    stagger?: number;
    y?: number;
    opacity?: number;
    trigger?: string | HTMLElement;
    start?: string;
  } = {}
) {
  const {
    duration = 0.6,
    stagger = 0.1,
    y = 40,
    opacity = 0,
    trigger,
    start = 'top 80%',
  } = options;

  const reducedMotion = prefersReducedMotion();

  return gsap.from(elements, {
    opacity,
    y: reducedMotion ? 0 : y,
    duration: reducedMotion ? 0.01 : duration,
    stagger: reducedMotion ? 0 : stagger,
    scrollTrigger: {
      trigger: trigger || elements,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Create a scroll progress animation
 * 
 * @param element - Element to animate based on scroll progress
 * @param fromVars - Starting animation properties
 * @param toVars - Ending animation properties
 * @param trigger - Trigger element
 */
export function createScrollProgress(
  element: string | HTMLElement,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  trigger?: string | HTMLElement
) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  timeline.fromTo(element, fromVars, toVars);

  return timeline;
}

/**
 * Kill all ScrollTrigger instances
 * Useful for cleanup on component unmount
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Refresh ScrollTrigger
 * Call this after DOM changes that affect layout
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

/**
 * Create a timeline with ScrollTrigger
 * 
 * @param options - ScrollTrigger options
 */
export function createScrollTimeline(options: ScrollTrigger.Vars = {}) {
  return gsap.timeline({
    scrollTrigger: {
      ...options,
    },
  });
}

export { gsap, ScrollTrigger };
