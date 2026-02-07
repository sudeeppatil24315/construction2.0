# Animation System Examples

This file contains practical examples of using the animation system in real components.

## Example 1: Animated Section with Fade-In (Using AnimateOnView)

```tsx
'use client';

import { AnimateOnView, StaggerChildren, AnimateOnViewItem } from '@/components/AnimateOnView';

export function AnimatedSection() {
  return (
    <AnimateOnView as="section" className="py-20">
      <StaggerChildren staggerDelay={0.15}>
        <AnimateOnViewItem>
          <h2 className="text-4xl font-bold mb-8">Our Services</h2>
        </AnimateOnViewItem>
        
        <AnimateOnViewItem>
          <p className="text-lg mb-12">
            We provide comprehensive construction solutions
          </p>
        </AnimateOnViewItem>
        
        <div className="grid grid-cols-3 gap-6">
          <AnimateOnViewItem>
            <div className="card">Service 1</div>
          </AnimateOnViewItem>
          <AnimateOnViewItem>
            <div className="card">Service 2</div>
          </AnimateOnViewItem>
          <AnimateOnViewItem>
            <div className="card">Service 3</div>
          </AnimateOnViewItem>
        </div>
      </StaggerChildren>
    </AnimateOnView>
  );
}
```

## Example 1b: Animated Section with Fade-In (Using Framer Motion directly)

```tsx
'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function AnimatedSectionDirect() {
  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className="py-20"
    >
      <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-8">
        Our Services
      </motion.h2>
      
      <motion.p variants={fadeInUp} className="text-lg mb-12">
        We provide comprehensive construction solutions
      </motion.p>
      
      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="card">
          Service 1
        </motion.div>
        <motion.div variants={fadeInUp} className="card">
          Service 2
        </motion.div>
        <motion.div variants={fadeInUp} className="card">
          Service 3
        </motion.div>
      </div>
    </motion.section>
  );
}
```

## Example 2: Interactive Button with Hover Effects

```tsx
'use client';

import { motion } from 'framer-motion';
import { scaleUp } from '@/lib/animations';

export function AnimatedButton({ children, onClick }: { 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      variants={scaleUp}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="bg-gold text-black px-8 py-4 rounded-lg font-semibold"
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </motion.button>
  );
}
```

## Example 3: Scroll-Triggered GSAP Animation

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap, createScrollTimeline } from '@/lib/animations';

export function BuildingConstructionAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const timeline = createScrollTimeline({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true,
    });

    // Animate building construction
    timeline
      .from('.foundation', { opacity: 0, y: 100, duration: 0.3 })
      .from('.walls', { scaleY: 0, transformOrigin: 'bottom', duration: 0.4 })
      .from('.roof', { opacity: 0, y: -50, duration: 0.3 });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen relative">
      <div className="foundation">Foundation</div>
      <div className="walls">Walls</div>
      <div className="roof">Roof</div>
    </div>
  );
}
```

## Example 4: Parallax Background

```tsx
'use client';

import { useParallaxScroll } from '@/lib/animations';

export function ParallaxHero() {
  const bgRef = useParallaxScroll(0.5);
  const contentRef = useParallaxScroll(0.2);

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      
      <div ref={contentRef} className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          SB Infra Projects
        </h1>
      </div>
    </section>
  );
}
```

## Example 5: Card with 3D Tilt Effect

```tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function TiltCard({ children }: { children: React.ReactNode }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      {children}
    </motion.div>
  );
}
```

## Example 6: Accessible Animation with Reduced Motion

```tsx
'use client';

import { motion } from 'framer-motion';
import { fadeInUp, getVariants, useReducedMotion } from '@/lib/animations';

export function AccessibleSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={getVariants(fadeInUp, prefersReducedMotion)}
      className="py-20"
    >
      <h2 className="text-4xl font-bold">
        Accessible Content
      </h2>
      <p className="mt-4">
        This section respects user motion preferences
      </p>
    </motion.section>
  );
}
```

## Example 7: Staggered Grid Animation

```tsx
'use client';

import { useStaggerScroll } from '@/lib/animations';

export function ProjectGrid({ projects }: { projects: any[] }) {
  const gridRef = useStaggerScroll('.project-card', 0.1, {
    start: 'top 80%',
  });

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <img src={project.image} alt={project.title} />
          <h3>{project.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## Example 8: Modal with Expand Animation

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { expand } from '@/lib/animations';

export function Modal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div
            variants={expand}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Example 9: Progress Bar Animation

```tsx
'use client';

import { motion } from 'framer-motion';
import { progressBar } from '@/lib/animations';

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        variants={progressBar}
        initial="initial"
        animate="animate"
        style={{ width: `${value}%` }}
        className="h-full bg-gold"
      />
    </div>
  );
}
```

## Example 10: Scroll Progress Indicator

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50"
    />
  );
}
```

## Example 11: Animated Counter

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';

export function AnimatedCounter({ 
  end, 
  duration = 2 
}: { 
  end: number;
  duration?: number;
}) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!counterRef.current) return;

    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(counter.value).toString();
        }
      },
    });
  }, [end, duration]);

  return <span ref={counterRef}>0</span>;
}
```

## Example 12: Hover Card with Gold Glow

```tsx
'use client';

import { motion } from 'framer-motion';

export function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)',
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="p-6 bg-black border border-gold/20 rounded-lg"
    >
      {children}
    </motion.div>
  );
}
```

## Tips for Using These Examples

1. **Always use 'use client'** directive for components with animations
2. **Clean up GSAP animations** in useEffect return functions
3. **Use viewport prop** with Framer Motion for scroll-triggered animations
4. **Test with reduced motion** enabled in browser DevTools
5. **Keep animations subtle** - less is often more
6. **Use consistent timing** across similar animations
7. **Optimize performance** by animating transform and opacity when possible
