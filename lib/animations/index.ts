/**
 * Animation System Entry Point
 * 
 * This module exports all animation utilities, variants, and configurations
 * for easy import throughout the application.
 */

// GSAP utilities and configuration
export {
  gsap,
  ScrollTrigger,
  initGSAP,
  createScrollAnimation,
  createParallax,
  createFadeIn,
  createStaggerAnimation,
  createScrollProgress,
  createScrollTimeline,
  killAllScrollTriggers,
  refreshScrollTrigger,
} from './gsap-config';

// Framer Motion variants
export {
  easings,
  transitions,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleUp,
  slideInUp,
  slideInDown,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  rotateIn,
  cardTilt,
  goldGlow,
  expand,
  blurIn,
  progressBar,
  bounceIn,
  shake,
  pulse,
  reducedMotion,
  getVariants,
  createFadeInVariants,
  createScaleVariants,
} from './framer-variants';

// Animation hooks
export { useReducedMotion } from './use-reduced-motion';
export { useScrollAnimation } from './use-scroll-animation';
export { useInView, useInViewFadeIn, useInViewStagger } from './use-in-view';
