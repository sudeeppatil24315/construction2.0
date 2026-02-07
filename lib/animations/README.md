# Animation System Documentation

This directory contains the complete animation system for the SB Infra Projects landing page, built with GSAP and Framer Motion.

## Overview

The animation system provides:
- **GSAP utilities** for scroll-based animations with ScrollTrigger
- **Framer Motion variants** for component animations
- **Custom React hooks** for easy animation integration
- **Reduced motion support** for accessibility

## Files

### `gsap-config.ts`
GSAP configuration and utility functions for scroll-triggered animations.

**Key Functions:**
- `initGSAP()` - Initialize GSAP with default settings
- `createScrollAnimation()` - Create scroll-triggered animations
- `createParallax()` - Create parallax scroll effects
- `createFadeIn()` - Fade in elements on scroll
- `createStaggerAnimation()` - Stagger multiple elements
- `createScrollProgress()` - Animate based on scroll progress
- `refreshScrollTrigger()` - Refresh after DOM changes
- `killAllScrollTriggers()` - Cleanup all scroll triggers

### `framer-variants.ts`
Reusable Framer Motion animation variants.

**Available Variants:**
- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`
- `scaleIn`, `scaleUp`
- `slideInUp`, `slideInDown`
- `staggerContainer`, `staggerContainerFast`, `staggerContainerSlow`
- `rotateIn`
- `cardTilt` - 3D card tilt effect
- `goldGlow` - Gold glow hover effect
- `expand` - Modal/panel expansion
- `blurIn` - Blur fade-in effect
- `progressBar` - Progress bar animation
- `bounceIn` - Bounce entrance
- `shake` - Shake for errors
- `pulse` - Pulsing attention effect
- `reducedMotion` - Minimal animation for accessibility

**Helper Functions:**
- `getVariants(variants, prefersReducedMotion)` - Get appropriate variants based on user preference
- `createFadeInVariants(y, duration)` - Create custom fade-in variants
- `createScaleVariants(initialScale, duration)` - Create custom scale variants

### `use-in-view.ts`
React hook for viewport detection using IntersectionObserver.

**Available Hooks:**
- `useInView(options)` - Generic viewport detection hook
- `useInViewFadeIn()` - Pre-configured for fade-in animations
- `useInViewStagger()` - Pre-configured for stagger animations

### `use-reduced-motion.ts`
React hook to detect user's reduced motion preference.

```tsx
const prefersReducedMotion = useReducedMotion();
```

### `use-scroll-animation.ts`
React hooks for GSAP scroll animations with automatic cleanup.

**Available Hooks:**
- `useScrollAnimation(animationFn, options, dependencies)` - Generic scroll animation
- `useFadeInScroll(options)` - Fade-in on scroll
- `useParallaxScroll(speed, options)` - Parallax effect
- `useScaleInScroll(options)` - Scale-in on scroll
- `useStaggerScroll(childSelector, stagger, options)` - Stagger children

### `index.ts`
Main entry point that exports all animation utilities.

## Components

### AnimateOnView

A powerful wrapper component that triggers animations when elements enter the viewport. See `components/AnimateOnView.md` for full documentation.

**Quick Example:**
```tsx
import { AnimateOnView, StaggerChildren, AnimateOnViewItem } from '@/components/AnimateOnView';

// Basic fade-in
<AnimateOnView>
  <section>Content fades in when scrolled into view</section>
</AnimateOnView>

// Staggered children
<StaggerChildren staggerDelay={0.15}>
  <AnimateOnViewItem><div>Item 1</div></AnimateOnViewItem>
  <AnimateOnViewItem><div>Item 2</div></AnimateOnViewItem>
  <AnimateOnViewItem><div>Item 3</div></AnimateOnViewItem>
</StaggerChildren>
```

## Usage Examples

### 1. GSAP Scroll Animations

#### Basic Fade-In on Scroll
```tsx
import { useEffect } from 'react';
import { createFadeIn } from '@/lib/animations';

function MyComponent() {
  useEffect(() => {
    const animation = createFadeIn('.my-element', {
      y: 80,
      duration: 1,
      start: 'top 80%',
    });

    return () => animation.kill();
  }, []);

  return <div className="my-element">Content</div>;
}
```

#### Parallax Effect
```tsx
import { useEffect } from 'react';
import { createParallax } from '@/lib/animations';

function ParallaxSection() {
  useEffect(() => {
    const animation = createParallax('.parallax-bg', 0.5);
    return () => animation.kill();
  }, []);

  return (
    <div className="relative">
      <div className="parallax-bg">Background</div>
      <div>Foreground Content</div>
    </div>
  );
}
```

#### Staggered Animation
```tsx
import { useEffect } from 'react';
import { createStaggerAnimation } from '@/lib/animations';

function CardGrid() {
  useEffect(() => {
    const animation = createStaggerAnimation('.card', {
      stagger: 0.15,
      y: 60,
      duration: 0.8,
    });

    return () => animation.kill();
  }, []);

  return (
    <div className="grid">
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
      <div className="card">Card 3</div>
    </div>
  );
}
```

### 2. Framer Motion Variants

#### Basic Fade-In
```tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

function AnimatedSection() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
    >
      Content fades in from bottom
    </motion.div>
  );
}
```

#### Staggered Children
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

function StaggeredList() {
  return (
    <motion.ul
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.li variants={fadeInUp}>Item 1</motion.li>
      <motion.li variants={fadeInUp}>Item 2</motion.li>
      <motion.li variants={fadeInUp}>Item 3</motion.li>
    </motion.ul>
  );
}
```

#### Hover Effects
```tsx
import { motion } from 'framer-motion';
import { scaleUp, goldGlow } from '@/lib/animations';

function InteractiveButton() {
  return (
    <motion.button
      variants={scaleUp}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="bg-gold text-black px-6 py-3 rounded"
    >
      Hover Me
    </motion.button>
  );
}
```

#### 3D Card Tilt
```tsx
import { motion } from 'framer-motion';
import { cardTilt } from '@/lib/animations';

function TiltCard() {
  return (
    <motion.div
      variants={cardTilt}
      initial="initial"
      whileHover="hover"
      style={{ transformStyle: 'preserve-3d' }}
      className="card"
    >
      Card Content
    </motion.div>
  );
}
```

### 3. Custom Hooks

#### Fade-In on Scroll
```tsx
import { useFadeInScroll } from '@/lib/animations';

function ScrollSection() {
  const ref = useFadeInScroll({
    start: 'top 80%',
    end: 'top 20%',
  });

  return <div ref={ref}>Fades in when scrolled into view</div>;
}
```

#### Parallax with Hook
```tsx
import { useParallaxScroll } from '@/lib/animations';

function ParallaxImage() {
  const ref = useParallaxScroll(0.3);

  return (
    <div className="relative overflow-hidden">
      <img ref={ref} src="/image.jpg" alt="Parallax" />
    </div>
  );
}
```

#### Stagger Children with Hook
```tsx
import { useStaggerScroll } from '@/lib/animations';

function StaggeredGrid() {
  const ref = useStaggerScroll('.grid-item', 0.1);

  return (
    <div ref={ref} className="grid">
      <div className="grid-item">Item 1</div>
      <div className="grid-item">Item 2</div>
      <div className="grid-item">Item 3</div>
    </div>
  );
}
```

### 4. Reduced Motion Support

#### With Framer Motion
```tsx
import { motion } from 'framer-motion';
import { fadeInUp, getVariants, useReducedMotion } from '@/lib/animations';

function AccessibleAnimation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={getVariants(fadeInUp, prefersReducedMotion)}
    >
      Respects user's motion preferences
    </motion.div>
  );
}
```

#### With GSAP
```tsx
import { useEffect } from 'react';
import { gsap, useReducedMotion } from '@/lib/animations';

function GSAPAnimation() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      // Instant transition
      gsap.set('.element', { opacity: 1, y: 0 });
    } else {
      // Animated transition
      gsap.from('.element', {
        opacity: 0,
        y: 60,
        duration: 0.8,
      });
    }
  }, [prefersReducedMotion]);

  return <div className="element">Content</div>;
}
```

## Best Practices

### 1. Performance
- Use `will-change` CSS property sparingly
- Prefer `transform` and `opacity` for animations
- Clean up animations on component unmount
- Use `scrub: true` for scroll-tied animations to improve performance

### 2. Accessibility
- Always check for reduced motion preferences
- Provide instant transitions when reduced motion is enabled
- Ensure animations don't interfere with keyboard navigation
- Don't rely solely on animation to convey information

### 3. Timing
- Use consistent easing functions throughout the app
- Keep animations between 200-600ms for UI interactions
- Use longer durations (800ms-1s) for entrance animations
- Stagger delays should be 50-150ms

### 4. Cleanup
- Always kill GSAP animations on unmount
- Use the custom hooks which handle cleanup automatically
- Call `refreshScrollTrigger()` after DOM changes

## Configuration

### GSAP Defaults
The system sets these defaults:
- Ease: `power2.out`
- Duration: `0.6s`
- ScrollTrigger toggleActions: `play none none none`

### Framer Motion Easings
Available custom easings:
- `easeOut`: `[0.22, 1, 0.36, 1]` - Smooth ease out (recommended)
- `easeInOut`: `[0.43, 0.13, 0.23, 0.96]` - Smooth ease in-out
- `spring`: `[0.68, -0.55, 0.265, 1.55]` - Spring-like ease
- `sharp`: `[0.4, 0, 0.2, 1]` - Sharp ease out

## Troubleshooting

### ScrollTrigger not working
1. Ensure GSAP is initialized: `initGSAP()`
2. Call `refreshScrollTrigger()` after DOM changes
3. Check that trigger element exists in DOM
4. Verify start/end positions with `markers: true`

### Animations not cleaning up
1. Use the provided hooks which handle cleanup
2. Always return cleanup function in useEffect
3. Call `killAllScrollTriggers()` when needed

### Reduced motion not working
1. Test with browser DevTools (Chrome: Rendering > Emulate CSS media)
2. Ensure `useReducedMotion` hook is called
3. Use `getVariants()` helper for Framer Motion

## Dependencies

- `gsap`: ^3.14.2
- `framer-motion`: ^12.33.0
- `react`: ^19.2.3

## License

Part of the SB Infra Projects landing page.
