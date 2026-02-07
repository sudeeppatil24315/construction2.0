/**
 * useScrollAnimation Hook
 * 
 * A React hook for creating GSAP scroll-triggered animations
 * with automatic cleanup.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Hook to create scroll-triggered animations with automatic cleanup
 * 
 * @param animationFn - Function that creates the GSAP animation
 * @param options - ScrollTrigger options
 * @param dependencies - Array of dependencies that trigger re-creation of animation
 */
export function useScrollAnimation(
  animationFn: (element: HTMLElement) => gsap.core.Animation | gsap.core.Timeline,
  options: ScrollAnimationOptions = {},
  dependencies: React.DependencyList = []
) {
  const elementRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const animation = animationFn(element);

    // Create ScrollTrigger
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: options.trigger || element,
      animation,
      start: options.start || 'top 80%',
      end: options.end || 'top 20%',
      scrub: options.scrub || false,
      pin: options.pin || false,
      markers: options.markers || false,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
    });

    // Cleanup function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      animation.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return elementRef;
}

/**
 * Hook to create a simple fade-in scroll animation
 * 
 * @param options - ScrollTrigger options
 */
export function useFadeInScroll(options: ScrollAnimationOptions = {}) {
  return useScrollAnimation(
    (element) => {
      return gsap.from(element, {
        opacity: 0,
        y: 60,
        duration: 0.8,
      });
    },
    options
  );
}

/**
 * Hook to create a parallax scroll effect
 * 
 * @param speed - Parallax speed multiplier
 * @param options - ScrollTrigger options
 */
export function useParallaxScroll(
  speed: number = 0.5,
  options: ScrollAnimationOptions = {}
) {
  return useScrollAnimation(
    (element) => {
      return gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
      });
    },
    {
      ...options,
      scrub: true,
      start: options.start || 'top bottom',
      end: options.end || 'bottom top',
    }
  );
}

/**
 * Hook to create a scale-in scroll animation
 * 
 * @param options - ScrollTrigger options
 */
export function useScaleInScroll(options: ScrollAnimationOptions = {}) {
  return useScrollAnimation(
    (element) => {
      return gsap.from(element, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
      });
    },
    options
  );
}

/**
 * Hook to create a stagger animation for child elements
 * 
 * @param childSelector - CSS selector for child elements
 * @param stagger - Stagger delay between children
 * @param options - ScrollTrigger options
 */
export function useStaggerScroll(
  childSelector: string = '> *',
  stagger: number = 0.1,
  options: ScrollAnimationOptions = {}
) {
  return useScrollAnimation(
    (element) => {
      const children = element.querySelectorAll(childSelector);
      return gsap.from(children, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger,
      });
    },
    options
  );
}
