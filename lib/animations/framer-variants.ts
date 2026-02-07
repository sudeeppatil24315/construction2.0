/**
 * Framer Motion Animation Variants
 * 
 * This module provides reusable animation variants for Framer Motion
 * to ensure consistent animations throughout the application.
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Custom easing functions
 */
export const easings = {
  // Smooth ease out (recommended for most UI animations)
  easeOut: [0.22, 1, 0.36, 1] as const,
  // Smooth ease in-out
  easeInOut: [0.43, 0.13, 0.23, 0.96] as const,
  // Spring-like ease
  spring: [0.68, -0.55, 0.265, 1.55] as const,
  // Sharp ease out
  sharp: [0.4, 0, 0.2, 1] as const,
};

/**
 * Default transition settings
 */
export const transitions = {
  default: {
    duration: 0.6,
    ease: easings.easeOut,
  } as Transition,
  fast: {
    duration: 0.3,
    ease: easings.easeOut,
  } as Transition,
  slow: {
    duration: 1,
    ease: easings.easeOut,
  } as Transition,
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  } as Transition,
};

/**
 * Fade in animation variants
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * Fade in from bottom animation variants
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.fast,
  },
};

/**
 * Fade in from top animation variants
 */
export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

/**
 * Fade in from left animation variants
 */
export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

/**
 * Fade in from right animation variants
 */
export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
};

/**
 * Scale in animation variants
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

/**
 * Scale up animation variants (for hover effects)
 */
export const scaleUp: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easings.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Slide in from bottom animation variants
 */
export const slideInUp: Variants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
    transition: transitions.default,
  },
  exit: {
    y: '100%',
    transition: transitions.fast,
  },
};

/**
 * Slide in from top animation variants
 */
export const slideInDown: Variants = {
  initial: {
    y: '-100%',
  },
  animate: {
    y: 0,
    transition: transitions.default,
  },
  exit: {
    y: '-100%',
    transition: transitions.fast,
  },
};

/**
 * Stagger children animation variants
 * Use on parent container
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger children with faster timing
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

/**
 * Stagger children with slower timing
 */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

/**
 * Rotate in animation variants
 */
export const rotateIn: Variants = {
  initial: {
    opacity: 0,
    rotate: -10,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    rotate: 10,
    transition: transitions.fast,
  },
};

/**
 * 3D card tilt effect variants
 */
export const cardTilt: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
  },
  hover: {
    rotateX: 5,
    rotateY: 5,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
};

/**
 * Gold glow effect variants (for buttons and interactive elements)
 */
export const goldGlow: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(212, 175, 55, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
};

/**
 * Expand animation variants (for modals, panels)
 */
export const expand: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
};

/**
 * Blur in animation variants
 */
export const blurIn: Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    transition: transitions.fast,
  },
};

/**
 * Progress bar animation variants
 */
export const progressBar: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: easings.easeOut,
    },
  },
};

/**
 * Bounce in animation variants
 */
export const bounceIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
    },
  },
};

/**
 * Shake animation variants (for errors)
 */
export const shake: Variants = {
  initial: {
    x: 0,
  },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Pulse animation variants (for attention)
 */
export const pulse: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
};

/**
 * Reduced motion variants
 * Use these when user prefers reduced motion
 */
export const reducedMotion: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.01,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01,
    },
  },
};

/**
 * Helper function to get variants based on reduced motion preference
 */
export function getVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? reducedMotion : variants;
}

/**
 * Helper function to create custom fade in variants with configurable values
 */
export function createFadeInVariants(
  y: number = 60,
  duration: number = 0.6
): Variants {
  return {
    initial: {
      opacity: 0,
      y,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: easings.easeOut,
      },
    },
    exit: {
      opacity: 0,
      y: y / 3,
      transition: {
        duration: duration * 0.5,
        ease: easings.easeOut,
      },
    },
  };
}

/**
 * Helper function to create custom scale variants
 */
export function createScaleVariants(
  initialScale: number = 0.8,
  duration: number = 0.6
): Variants {
  return {
    initial: {
      opacity: 0,
      scale: initialScale,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        ease: easings.easeOut,
      },
    },
    exit: {
      opacity: 0,
      scale: initialScale,
      transition: {
        duration: duration * 0.5,
        ease: easings.easeOut,
      },
    },
  };
}
