/**
 * AnimateOnView Component
 * 
 * A wrapper component that triggers animations when elements enter the viewport.
 * Uses IntersectionObserver for efficient viewport detection.
 */

'use client';

import { motion, Variants } from 'framer-motion';
import { useInView } from '@/lib/animations/use-in-view';
import { useReducedMotion } from '@/lib/animations';
import {
  fadeInUp,
  getVariants,
} from '@/lib/animations';

interface AnimateOnViewProps {
  /**
   * Child elements to animate
   */
  children: React.ReactNode;
  
  /**
   * Animation variant to use
   * Default: 'fadeInUp'
   */
  variant?: 'fadeInUp' | 'fadeIn' | 'scaleIn' | 'slideInUp' | 'custom';
  
  /**
   * Custom animation variants (when variant is 'custom')
   */
  customVariants?: Variants;
  
  /**
   * Whether to stagger children animations
   * Default: false
   */
  stagger?: boolean;
  
  /**
   * Stagger delay between children (in seconds)
   * Default: 0.1
   */
  staggerDelay?: number;
  
  /**
   * Delay before animation starts (in seconds)
   * Default: 0
   */
  delay?: number;
  
  /**
   * Root margin for IntersectionObserver
   * Default: '-100px 0px'
   */
  rootMargin?: string;
  
  /**
   * Threshold for IntersectionObserver (0-1)
   * Default: 0.1
   */
  threshold?: number;
  
  /**
   * Whether to trigger animation only once
   * Default: true
   */
  once?: boolean;
  
  /**
   * HTML element type to render
   * Default: 'div'
   */
  as?: keyof React.JSX.IntrinsicElements;
  
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
 * Component that animates children when they enter the viewport
 */
export function AnimateOnView({
  children,
  variant = 'fadeInUp',
  customVariants,
  stagger = false,
  staggerDelay = 0.1,
  delay = 0,
  rootMargin = '-100px 0px',
  threshold = 0.1,
  once = true,
  as = 'div',
  className,
  style,
}: AnimateOnViewProps) {
  const [ref, isInView] = useInView({
    rootMargin,
    threshold,
    once,
  });
  
  const prefersReducedMotion = useReducedMotion();

  // Get the appropriate animation variants
  const getAnimationVariants = (): Variants => {
    if (customVariants) return customVariants;
    
    // Import variants based on the variant prop
    switch (variant) {
      case 'fadeInUp':
        return fadeInUp;
      case 'fadeIn':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case 'scaleIn':
        return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } };
      case 'slideInUp':
        return { initial: { y: '100%' }, animate: { y: 0 } };
      default:
        return fadeInUp;
    }
  };

  const animationVariants = getVariants(
    getAnimationVariants(),
    prefersReducedMotion
  );

  // Create container variants with stagger if needed
  const containerVariants: Variants = stagger
    ? {
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : {
        initial: {},
        animate: {
          transition: {
            delay,
          },
        },
      };

  const MotionComponent = motion[as as keyof typeof motion] as any;

  return (
    <MotionComponent
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={stagger ? containerVariants : animationVariants}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Wrapper for individual items in a staggered animation
 * Use this as a child of AnimateOnView with stagger={true}
 */
export function AnimateOnViewItem({
  children,
  className,
  style,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as as keyof typeof motion] as any;

  const itemVariants = getVariants(fadeInUp, prefersReducedMotion);

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

/**
 * Pre-configured component for fade-in-up animation
 */
export function FadeInUp({
  children,
  delay = 0,
  className,
  style,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <AnimateOnView
      variant="fadeInUp"
      delay={delay}
      className={className}
      style={style}
      as={as}
    >
      {children}
    </AnimateOnView>
  );
}

/**
 * Pre-configured component for staggered children animations
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className,
  style,
  as = 'div',
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <AnimateOnView
      variant="fadeInUp"
      stagger={true}
      staggerDelay={staggerDelay}
      delay={delay}
      className={className}
      style={style}
      as={as}
    >
      {children}
    </AnimateOnView>
  );
}
