'use client';

import { useEffect, useRef } from 'react';
import { createParallax } from '@/lib/animations/gsap-config';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxBackground({
  children,
  speed = 0.5,
  className = '',
}: ParallaxBackgroundProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const animation = createParallax(elementRef.current, speed);

    return () => {
      animation.kill();
    };
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
