/**
 * PageLoadAnimator Component
 * 
 * Orchestrates page load animations in a logical sequence (top to bottom).
 * Animates elements with natural easing functions and respects reduced motion preferences.
 * 
 * Validates: Requirements 5.6, 5.4
 */

'use client';

import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/animations';
import { easings } from '@/lib/animations';

interface PageLoadAnimatorProps {
  /**
   * Child elements to animate
   */
  children: React.ReactNode;
  
  /**
   * Delay before starting the animation sequence (in seconds)
   * Default: 0
   */
  delay?: number;
  
  /**
   * Stagger delay between children (in seconds)
   * Default: 0.15
   */
  staggerDelay?: number;
  
  /**
   * Animation duration for each element (in seconds)
   * Default: 0.6
   */
  duration?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Container variants for orchestrating page load animations
 * Animates children in sequence from top to bottom
 */
const createContainerVariants = (
  delay: number,
  staggerDelay: number,
  prefersReducedMotion: boolean
): Variants => ({
  initial: {},
  animate: {
    transition: {
      delayChildren: prefersReducedMotion ? 0 : delay,
      staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      staggerDirection: 1, // Top to bottom
    },
  },
});

/**
 * Item variants for individual elements
 * Uses natural easing for smooth motion
 */
const createItemVariants = (
  duration: number,
  prefersReducedMotion: boolean
): Variants => ({
  initial: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.01 : duration,
      ease: easings.easeOut, // Natural motion easing
    },
  },
});

/**
 * Component that orchestrates page load animations in logical sequence
 * 
 * Usage:
 * ```tsx
 * <PageLoadAnimator>
 *   <PageLoadAnimator.Item>First element</PageLoadAnimator.Item>
 *   <PageLoadAnimator.Item>Second element</PageLoadAnimator.Item>
 *   <PageLoadAnimator.Item>Third element</PageLoadAnimator.Item>
 * </PageLoadAnimator>
 * ```
 */
export function PageLoadAnimator({
  children,
  delay = 0,
  staggerDelay = 0.15,
  duration = 0.6,
  className,
  style,
}: PageLoadAnimatorProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const containerVariants = createContainerVariants(
    delay,
    staggerDelay,
    prefersReducedMotion
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item component for page load animations
 * Use as a child of PageLoadAnimator
 */
interface PageLoadAnimatorItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
  duration?: number;
}

function PageLoadAnimatorItem({
  children,
  className,
  style,
  as = 'div',
  duration = 0.6,
}: PageLoadAnimatorItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as as keyof typeof motion] as any;
  
  const itemVariants = createItemVariants(duration, prefersReducedMotion);

  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}

// Attach Item as a property of PageLoadAnimator for convenient usage
PageLoadAnimator.Item = PageLoadAnimatorItem;

export default PageLoadAnimator;
