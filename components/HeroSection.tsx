'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Scene3DErrorBoundary from './Scene3DErrorBoundary';
import { detectWebGLSupport } from '@/lib/webgl-detector';
import { useReducedMotion } from '@/lib/animations';

// Dynamically import 3D scene to avoid SSR issues
const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-gold text-xl">Loading 3D Scene...</div>
    </div>
  ),
});

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check WebGL support on mount
    setWebGLSupported(detectWebGLSupport());

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offsets - disable if user prefers reduced motion
  const parallaxOffset = prefersReducedMotion ? 0 : scrollY * 0.5;
  const opacityFade = prefersReducedMotion ? 1 : Math.max(0, 1 - scrollY / 500);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Scene Background with parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {webGLSupported ? (
          <Scene3DErrorBoundary>
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-gold text-xl">Loading 3D Scene...</div>
                </div>
              }
            >
              <Hero3DScene />
            </Suspense>
          </Scene3DErrorBoundary>
        ) : (
          <Scene3DErrorBoundary>
            <div />
          </Scene3DErrorBoundary>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />

      {/* Content Overlay with parallax */}
      <div
        className="relative z-20 container mx-auto px-4 text-center"
        style={{
          transform: `translateY(${parallaxOffset * 0.3}px)`,
          opacity: opacityFade,
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
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
