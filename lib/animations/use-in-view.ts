/**
 * useInView Hook
 * 
 * A React hook that detects when an element enters the viewport
 * using IntersectionObserver API.
 */

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /**
   * The root element for intersection detection
   * Default: null (viewport)
   */
  root?: Element | null;
  
  /**
   * Margin around the root element
   * Default: '0px'
   */
  rootMargin?: string;
  
  /**
   * Threshold for intersection (0-1)
   * Default: 0.1 (10% visible)
   */
  threshold?: number | number[];
  
  /**
   * Whether to trigger only once
   * Default: true
   */
  once?: boolean;
  
  /**
   * Whether the element is initially in view
   * Default: false
   */
  initialInView?: boolean;
}

/**
 * Hook to detect when an element enters the viewport
 * 
 * @param options - IntersectionObserver options
 * @returns [ref, isInView] - Ref to attach to element and boolean indicating if in view
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    once = true,
    initialInView = false,
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(initialInView);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and once is true, don't observe again
    if (hasTriggered.current && once) return;

    // Create IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            hasTriggered.current = true;

            // If once is true, unobserve after first trigger
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            // If not once, update state when leaving viewport
            setIsInView(false);
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once]);

  return [ref, isInView];
}

/**
 * Hook variant with default settings for fade-in animations
 * Triggers when element is 10% visible
 */
export function useInViewFadeIn<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean
] {
  return useInView<T>({
    rootMargin: '-100px 0px',
    threshold: 0.1,
    once: true,
  });
}

/**
 * Hook variant for stagger animations
 * Triggers earlier (when element is at bottom of viewport)
 */
export function useInViewStagger<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean
] {
  return useInView<T>({
    rootMargin: '0px 0px -50px 0px',
    threshold: 0,
    once: true,
  });
}
