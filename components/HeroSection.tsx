'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Scene3DErrorBoundary from './Scene3DErrorBoundary';
import CursorFollower from './CursorFollower';
import { detectWebGLSupport } from '@/lib/webgl-detector';
import { detectDeviceCapabilities } from '@/lib/device-detector';
import { useReducedMotion } from '@/lib/animations';

// Dynamically import 3D scene to avoid SSR issues
const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="text-gold text-xl animate-pulse">Loading 3D Scene...</div>
    </div>
  ),
});

// Dynamically import 2D fallback
const Hero2DFallback = dynamic(() => import('./Hero2DFallback'), {
  ssr: false,
});

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [use2DFallback, setUse2DFallback] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setMounted(true);

    // Check WebGL support and device capabilities on mount
    const hasWebGL = detectWebGLSupport();
    setWebGLSupported(hasWebGL);

    // Detect device capabilities and determine if 2D fallback should be used
    const deviceCaps = detectDeviceCapabilities();
    const shouldUse2D = !hasWebGL || deviceCaps.recommendedQuality === '2d-fallback';
    setUse2DFallback(shouldUse2D);

    // Throttled scroll handler to reduce re-renders - only update every 16ms (60fps)
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only update if scroll changed significantly (more than 5px)
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(currentScrollY);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offsets - much more subtle to prevent disappearing
  // Memoize to prevent unnecessary recalculations
  const parallaxOffset = useMemo(
    () => (prefersReducedMotion ? 0 : Math.min(scrollY * 0.15, 100)), // Cap at 100px
    [prefersReducedMotion, scrollY]
  );
  const opacityFade = useMemo(
    () => (prefersReducedMotion ? 1 : Math.max(0.3, 1 - scrollY / 800)), // Fade slower, min 0.3
    [prefersReducedMotion, scrollY]
  );

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
      >
        <div className="text-gold text-xl animate-pulse">Loading...</div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Scene Background - Fixed position, no parallax */}
      <div className="absolute inset-0 z-0">
        {use2DFallback ? (
          <Hero2DFallback key="2d-fallback" />
        ) : webGLSupported ? (
          <Scene3DErrorBoundary key="3d-scene">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
                  <div className="text-gold text-xl animate-pulse">Loading 3D Scene...</div>
                </div>
              }
            >
              <Hero3DScene key="hero-3d-stable" />
            </Suspense>
          </Scene3DErrorBoundary>
        ) : (
          <Hero2DFallback key="2d-fallback-no-webgl" />
        )}
      </div>

      {/* Cursor Follower Effect - Only in hero section */}
      {!prefersReducedMotion && mounted && (
        <div className="absolute inset-0 z-5 pointer-events-none">
          <CursorFollower variant="spotlight" size={400} intensity={0.2} />
        </div>
      )}

      {/* Gradient Overlay - with very subtle parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10"
        style={{
          transform: `translate3d(0, ${parallaxOffset * 0.1}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Content Overlay with subtle parallax */}
      <div
        className="relative z-20 container mx-auto px-4 text-center"
        style={{
          transform: `translate3d(0, ${parallaxOffset * 0.08}px, 0)`,
          opacity: opacityFade,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Company Logo/Name */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in">
            SB INFRA{' '}
            <span className="text-gold block sm:inline">PROJECTS</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 animate-fade-in-delay">
            Building Excellence Through Innovation
          </p>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-delay-2">
            Premium construction services for residential, commercial, and industrial projects
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                element?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
              className="group relative px-8 py-4 bg-gold text-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50 w-full sm:w-auto"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('projects');
                element?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
              className="px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg transition-all duration-300 hover:bg-gold hover:text-black hover:scale-105 w-full sm:w-auto"
            >
              View Projects
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gold">
            <span className="text-sm">Scroll to explore</span>
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
