'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxLayersProps {
  className?: string;
}

export default function ParallaxLayers({ className = '' }: ParallaxLayersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const animations: gsap.core.Tween[] = [];

    // Layer 1 - Slowest (background)
    if (layer1Ref.current) {
      animations.push(
        gsap.to(layer1Ref.current, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      );
    }

    // Layer 2 - Medium speed
    if (layer2Ref.current) {
      animations.push(
        gsap.to(layer2Ref.current, {
          y: '50%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      );
    }

    // Layer 3 - Fastest (foreground)
    if (layer3Ref.current) {
      animations.push(
        gsap.to(layer3Ref.current, {
          y: '70%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      );
    }

    return () => {
      animations.forEach((anim) => anim.kill());
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.trigger === containerRef.current ||
          trigger.trigger === layer1Ref.current ||
          trigger.trigger === layer2Ref.current ||
          trigger.trigger === layer3Ref.current
        ) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Layer 1 - Background circles */}
      <div ref={layer1Ref} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Layer 2 - Medium geometric shapes */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-gold/10 rotate-45" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 border border-gold/10 rounded-full" />
      </div>

      {/* Layer 3 - Foreground accents */}
      <div ref={layer3Ref} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-gold/30 rounded-full" />
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-gold/30 rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-gold/30 rounded-full" />
      </div>
    </div>
  );
}
