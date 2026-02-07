/**
 * Responsive Breakpoint Utilities
 * 
 * Provides utilities for handling responsive design across mobile, tablet, and desktop viewports.
 * Follows mobile-first approach as specified in requirements 8.1, 8.6, and 27.8.
 */

// Breakpoint definitions matching design specifications
export const BREAKPOINTS = {
  mobile: {
    min: 320,
    max: 767,
    label: 'mobile',
  },
  tablet: {
    min: 768,
    max: 1023,
    label: 'tablet',
  },
  desktop: {
    min: 1024,
    max: 1439,
    label: 'desktop',
  },
  wide: {
    min: 1440,
    max: Infinity,
    label: 'wide',
  },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.wide.min) return 'wide';
  if (width >= BREAKPOINTS.desktop.min) return 'desktop';
  if (width >= BREAKPOINTS.tablet.min) return 'tablet';
  return 'mobile';
}

/**
 * Check if current viewport is mobile (320px-767px)
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.mobile.min && width <= BREAKPOINTS.mobile.max;
}

/**
 * Check if current viewport is tablet (768px-1023px)
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max;
}

/**
 * Check if current viewport is desktop (1024px+)
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.desktop.min;
}

/**
 * Check if current viewport is mobile or tablet (< 1024px)
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.desktop.min;
}

/**
 * Get 3D quality level based on current breakpoint
 * Mobile: low quality for performance
 * Tablet: medium quality
 * Desktop/Wide: high quality
 */
export function get3DQualityForBreakpoint(): '3d-low' | '3d-medium' | '3d-high' {
  const breakpoint = getCurrentBreakpoint();
  
  switch (breakpoint) {
    case 'mobile':
      return '3d-low';
    case 'tablet':
      return '3d-medium';
    case 'desktop':
    case 'wide':
    default:
      return '3d-high';
  }
}

/**
 * Get particle count based on current breakpoint for performance optimization
 */
export function getParticleCountForBreakpoint(): number {
  const breakpoint = getCurrentBreakpoint();
  
  switch (breakpoint) {
    case 'mobile':
      return 30; // Minimal particles for mobile
    case 'tablet':
      return 60; // Medium particle count
    case 'desktop':
      return 100; // Full particle count
    case 'wide':
      return 150; // Enhanced particle count for large screens
    default:
      return 60;
  }
}

/**
 * Check if viewport width will cause horizontal scrolling
 * Returns true if content might overflow horizontally
 */
export function hasHorizontalScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.scrollWidth > window.innerWidth;
}

/**
 * Get responsive font size multiplier based on breakpoint
 */
export function getFontSizeMultiplier(): number {
  const breakpoint = getCurrentBreakpoint();
  
  switch (breakpoint) {
    case 'mobile':
      return 0.875; // 87.5% of base size
    case 'tablet':
      return 0.9375; // 93.75% of base size
    case 'desktop':
      return 1; // 100% base size
    case 'wide':
      return 1.125; // 112.5% of base size
    default:
      return 1;
  }
}

/**
 * Get responsive spacing multiplier based on breakpoint
 */
export function getSpacingMultiplier(): number {
  const breakpoint = getCurrentBreakpoint();
  
  switch (breakpoint) {
    case 'mobile':
      return 0.75; // Reduced spacing for mobile
    case 'tablet':
      return 0.875; // Slightly reduced spacing
    case 'desktop':
    case 'wide':
      return 1; // Full spacing
    default:
      return 1;
  }
}

/**
 * React hook for responsive breakpoint detection
 * Returns current breakpoint and updates on window resize
 */
export function useBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(getCurrentBreakpoint());
  
  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
}

// Import React for the hook
import React from 'react';

/**
 * React hook for checking if viewport is mobile
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setMobile(isMobile());
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return mobile;
}

/**
 * React hook for checking if viewport is tablet
 */
export function useIsTablet(): boolean {
  const [tablet, setTablet] = React.useState(false);
  
  React.useEffect(() => {
    const checkTablet = () => setTablet(isTablet());
    checkTablet();
    
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);
  
  return tablet;
}

/**
 * React hook for checking if viewport is desktop
 */
export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = React.useState(false);
  
  React.useEffect(() => {
    const checkDesktop = () => setDesktop(isDesktop());
    checkDesktop();
    
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  
  return desktop;
}

/**
 * Tailwind CSS breakpoint classes for responsive design
 * Use these in className strings for consistent responsive behavior
 */
export const TAILWIND_BREAKPOINTS = {
  mobile: '', // Default (mobile-first)
  tablet: 'md:', // 768px and up
  desktop: 'lg:', // 1024px and up
  wide: 'xl:', // 1440px and up
} as const;

/**
 * Container padding classes for responsive layouts
 * Ensures proper spacing on all screen sizes
 */
export const CONTAINER_PADDING = {
  mobile: 'px-4', // 16px horizontal padding
  tablet: 'md:px-6', // 24px horizontal padding
  desktop: 'lg:px-8', // 32px horizontal padding
  wide: 'xl:px-12', // 48px horizontal padding
} as const;

/**
 * Get all container padding classes as a single string
 */
export function getContainerPaddingClasses(): string {
  return Object.values(CONTAINER_PADDING).join(' ');
}

/**
 * Section spacing classes for consistent vertical rhythm
 */
export const SECTION_SPACING = {
  mobile: 'py-12', // 48px vertical padding
  tablet: 'md:py-16', // 64px vertical padding
  desktop: 'lg:py-20', // 80px vertical padding
  wide: 'xl:py-24', // 96px vertical padding
} as const;

/**
 * Get all section spacing classes as a single string
 */
export function getSectionSpacingClasses(): string {
  return Object.values(SECTION_SPACING).join(' ');
}
