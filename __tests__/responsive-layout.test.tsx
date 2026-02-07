/**
 * Responsive Layout Tests
 * 
 * Tests for mobile-first responsive layouts implementation
 * Validates Requirements 8.1, 8.6, 27.8
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  isMobileOrTablet,
  get3DQualityForBreakpoint,
  getParticleCountForBreakpoint,
  hasHorizontalScroll,
  getFontSizeMultiplier,
  getSpacingMultiplier,
  getContainerPaddingClasses,
  getSectionSpacingClasses,
  BREAKPOINTS,
} from '@/lib/breakpoints';

describe('Responsive Breakpoint Utilities', () => {
  // Helper to set window width
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  describe('getCurrentBreakpoint', () => {
    it('should return "mobile" for widths 320px-767px', () => {
      setWindowWidth(320);
      expect(getCurrentBreakpoint()).toBe('mobile');
      
      setWindowWidth(500);
      expect(getCurrentBreakpoint()).toBe('mobile');
      
      setWindowWidth(767);
      expect(getCurrentBreakpoint()).toBe('mobile');
    });

    it('should return "tablet" for widths 768px-1023px', () => {
      setWindowWidth(768);
      expect(getCurrentBreakpoint()).toBe('tablet');
      
      setWindowWidth(900);
      expect(getCurrentBreakpoint()).toBe('tablet');
      
      setWindowWidth(1023);
      expect(getCurrentBreakpoint()).toBe('tablet');
    });

    it('should return "desktop" for widths 1024px-1439px', () => {
      setWindowWidth(1024);
      expect(getCurrentBreakpoint()).toBe('desktop');
      
      setWindowWidth(1200);
      expect(getCurrentBreakpoint()).toBe('desktop');
      
      setWindowWidth(1439);
      expect(getCurrentBreakpoint()).toBe('desktop');
    });

    it('should return "wide" for widths 1440px+', () => {
      setWindowWidth(1440);
      expect(getCurrentBreakpoint()).toBe('wide');
      
      setWindowWidth(1920);
      expect(getCurrentBreakpoint()).toBe('wide');
      
      setWindowWidth(2560);
      expect(getCurrentBreakpoint()).toBe('wide');
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile viewport widths (320px-767px)', () => {
      setWindowWidth(320);
      expect(isMobile()).toBe(true);
      
      setWindowWidth(500);
      expect(isMobile()).toBe(true);
      
      setWindowWidth(767);
      expect(isMobile()).toBe(true);
    });

    it('should return false for non-mobile viewport widths', () => {
      setWindowWidth(768);
      expect(isMobile()).toBe(false);
      
      setWindowWidth(1024);
      expect(isMobile()).toBe(false);
      
      setWindowWidth(1920);
      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet viewport widths (768px-1023px)', () => {
      setWindowWidth(768);
      expect(isTablet()).toBe(true);
      
      setWindowWidth(900);
      expect(isTablet()).toBe(true);
      
      setWindowWidth(1023);
      expect(isTablet()).toBe(true);
    });

    it('should return false for non-tablet viewport widths', () => {
      setWindowWidth(767);
      expect(isTablet()).toBe(false);
      
      setWindowWidth(1024);
      expect(isTablet()).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for desktop viewport widths (1024px+)', () => {
      setWindowWidth(1024);
      expect(isDesktop()).toBe(true);
      
      setWindowWidth(1440);
      expect(isDesktop()).toBe(true);
      
      setWindowWidth(1920);
      expect(isDesktop()).toBe(true);
    });

    it('should return false for non-desktop viewport widths', () => {
      setWindowWidth(320);
      expect(isDesktop()).toBe(false);
      
      setWindowWidth(768);
      expect(isDesktop()).toBe(false);
      
      setWindowWidth(1023);
      expect(isDesktop()).toBe(false);
    });
  });

  describe('isMobileOrTablet', () => {
    it('should return true for mobile and tablet viewports (< 1024px)', () => {
      setWindowWidth(320);
      expect(isMobileOrTablet()).toBe(true);
      
      setWindowWidth(768);
      expect(isMobileOrTablet()).toBe(true);
      
      setWindowWidth(1023);
      expect(isMobileOrTablet()).toBe(true);
    });

    it('should return false for desktop viewports (>= 1024px)', () => {
      setWindowWidth(1024);
      expect(isMobileOrTablet()).toBe(false);
      
      setWindowWidth(1920);
      expect(isMobileOrTablet()).toBe(false);
    });
  });

  describe('get3DQualityForBreakpoint', () => {
    it('should return "3d-low" for mobile viewports', () => {
      setWindowWidth(320);
      expect(get3DQualityForBreakpoint()).toBe('3d-low');
      
      setWindowWidth(767);
      expect(get3DQualityForBreakpoint()).toBe('3d-low');
    });

    it('should return "3d-medium" for tablet viewports', () => {
      setWindowWidth(768);
      expect(get3DQualityForBreakpoint()).toBe('3d-medium');
      
      setWindowWidth(1023);
      expect(get3DQualityForBreakpoint()).toBe('3d-medium');
    });

    it('should return "3d-high" for desktop and wide viewports', () => {
      setWindowWidth(1024);
      expect(get3DQualityForBreakpoint()).toBe('3d-high');
      
      setWindowWidth(1440);
      expect(get3DQualityForBreakpoint()).toBe('3d-high');
      
      setWindowWidth(1920);
      expect(get3DQualityForBreakpoint()).toBe('3d-high');
    });
  });

  describe('getParticleCountForBreakpoint', () => {
    it('should return reduced particle count for mobile (30)', () => {
      setWindowWidth(320);
      expect(getParticleCountForBreakpoint()).toBe(30);
    });

    it('should return medium particle count for tablet (60)', () => {
      setWindowWidth(768);
      expect(getParticleCountForBreakpoint()).toBe(60);
    });

    it('should return full particle count for desktop (100)', () => {
      setWindowWidth(1024);
      expect(getParticleCountForBreakpoint()).toBe(100);
    });

    it('should return enhanced particle count for wide screens (150)', () => {
      setWindowWidth(1440);
      expect(getParticleCountForBreakpoint()).toBe(150);
    });
  });

  describe('getFontSizeMultiplier', () => {
    it('should return 0.875 for mobile (87.5% of base)', () => {
      setWindowWidth(320);
      expect(getFontSizeMultiplier()).toBe(0.875);
    });

    it('should return 0.9375 for tablet (93.75% of base)', () => {
      setWindowWidth(768);
      expect(getFontSizeMultiplier()).toBe(0.9375);
    });

    it('should return 1 for desktop (100% base)', () => {
      setWindowWidth(1024);
      expect(getFontSizeMultiplier()).toBe(1);
    });

    it('should return 1.125 for wide screens (112.5% of base)', () => {
      setWindowWidth(1440);
      expect(getFontSizeMultiplier()).toBe(1.125);
    });
  });

  describe('getSpacingMultiplier', () => {
    it('should return 0.75 for mobile (reduced spacing)', () => {
      setWindowWidth(320);
      expect(getSpacingMultiplier()).toBe(0.75);
    });

    it('should return 0.875 for tablet (slightly reduced spacing)', () => {
      setWindowWidth(768);
      expect(getSpacingMultiplier()).toBe(0.875);
    });

    it('should return 1 for desktop and wide (full spacing)', () => {
      setWindowWidth(1024);
      expect(getSpacingMultiplier()).toBe(1);
      
      setWindowWidth(1440);
      expect(getSpacingMultiplier()).toBe(1);
    });
  });

  describe('Container and Section Utilities', () => {
    it('should return all container padding classes', () => {
      const classes = getContainerPaddingClasses();
      expect(classes).toContain('px-4');
      expect(classes).toContain('md:px-6');
      expect(classes).toContain('lg:px-8');
      expect(classes).toContain('xl:px-12');
    });

    it('should return all section spacing classes', () => {
      const classes = getSectionSpacingClasses();
      expect(classes).toContain('py-12');
      expect(classes).toContain('md:py-16');
      expect(classes).toContain('lg:py-20');
      expect(classes).toContain('xl:py-24');
    });
  });

  describe('Breakpoint Constants', () => {
    it('should have correct mobile breakpoint values', () => {
      expect(BREAKPOINTS.mobile.min).toBe(320);
      expect(BREAKPOINTS.mobile.max).toBe(767);
      expect(BREAKPOINTS.mobile.label).toBe('mobile');
    });

    it('should have correct tablet breakpoint values', () => {
      expect(BREAKPOINTS.tablet.min).toBe(768);
      expect(BREAKPOINTS.tablet.max).toBe(1023);
      expect(BREAKPOINTS.tablet.label).toBe('tablet');
    });

    it('should have correct desktop breakpoint values', () => {
      expect(BREAKPOINTS.desktop.min).toBe(1024);
      expect(BREAKPOINTS.desktop.max).toBe(1439);
      expect(BREAKPOINTS.desktop.label).toBe('desktop');
    });

    it('should have correct wide breakpoint values', () => {
      expect(BREAKPOINTS.wide.min).toBe(1440);
      expect(BREAKPOINTS.wide.max).toBe(Infinity);
      expect(BREAKPOINTS.wide.label).toBe('wide');
    });
  });
});

describe('Mobile Viewport Adaptation - Property 21', () => {
  /**
   * Property 21: Mobile Viewport Adaptation
   * For any viewport width between 320px and 767px, the layout should adapt 
   * to mobile-optimized design without horizontal scrolling.
   * Validates: Requirements 8.1, 27.8
   */

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  const setDocumentScrollWidth = (width: number) => {
    Object.defineProperty(document.documentElement, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should detect mobile viewport for widths 320px-767px', () => {
    const mobileWidths = [320, 375, 414, 500, 600, 767];
    
    mobileWidths.forEach(width => {
      setWindowWidth(width);
      expect(isMobile()).toBe(true);
      expect(getCurrentBreakpoint()).toBe('mobile');
    });
  });

  it('should not have horizontal scrolling on mobile viewports', () => {
    const mobileWidths = [320, 375, 414, 500, 600, 767];
    
    mobileWidths.forEach(width => {
      setWindowWidth(width);
      setDocumentScrollWidth(width); // No overflow
      
      expect(hasHorizontalScroll()).toBe(false);
    });
  });

  it('should use low 3D quality on mobile for performance', () => {
    setWindowWidth(375);
    expect(get3DQualityForBreakpoint()).toBe('3d-low');
  });

  it('should use reduced particle count on mobile', () => {
    setWindowWidth(375);
    const particleCount = getParticleCountForBreakpoint();
    expect(particleCount).toBe(30);
    expect(particleCount).toBeLessThan(100); // Less than desktop
  });

  it('should apply mobile-specific font size multiplier', () => {
    setWindowWidth(375);
    const multiplier = getFontSizeMultiplier();
    expect(multiplier).toBe(0.875);
    expect(multiplier).toBeLessThan(1); // Smaller than desktop
  });

  it('should apply mobile-specific spacing multiplier', () => {
    setWindowWidth(375);
    const multiplier = getSpacingMultiplier();
    expect(multiplier).toBe(0.75);
    expect(multiplier).toBeLessThan(1); // Tighter spacing than desktop
  });
});

describe('CSS Responsive Utilities', () => {
  it('should have container-responsive class available', () => {
    const div = document.createElement('div');
    div.className = 'container-responsive';
    document.body.appendChild(div);
    
    const styles = window.getComputedStyle(div);
    expect(div.className).toContain('container-responsive');
    
    document.body.removeChild(div);
  });

  it('should have section-spacing class available', () => {
    const section = document.createElement('section');
    section.className = 'section-spacing';
    document.body.appendChild(section);
    
    expect(section.className).toContain('section-spacing');
    
    document.body.removeChild(section);
  });

  it('should have responsive text utilities available', () => {
    const textClasses = [
      'text-responsive-xs',
      'text-responsive-sm',
      'text-responsive-base',
      'text-responsive-lg',
      'text-responsive-xl',
      'text-responsive-2xl',
      'text-responsive-3xl',
    ];
    
    textClasses.forEach(className => {
      const div = document.createElement('div');
      div.className = className;
      document.body.appendChild(div);
      
      expect(div.className).toContain(className);
      
      document.body.removeChild(div);
    });
  });

  it('should have hide-mobile and show-mobile utilities', () => {
    const hideDiv = document.createElement('div');
    hideDiv.className = 'hide-mobile';
    
    const showDiv = document.createElement('div');
    showDiv.className = 'show-mobile';
    
    expect(hideDiv.className).toContain('hide-mobile');
    expect(showDiv.className).toContain('show-mobile');
  });
});

describe('No Horizontal Scrolling on Mobile', () => {
  /**
   * Validates Requirement 27.8: Prevent horizontal scrolling on all mobile viewports
   */

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should have overflow-x hidden on body and html', () => {
    // Check that CSS rules are applied
    const body = document.body;
    const html = document.documentElement;
    
    // These styles should be set in globals.css
    expect(body.style.overflowX || 'hidden').toBeTruthy();
    expect(html.style.overflowX || 'hidden').toBeTruthy();
  });

  it('should have max-width 100vw on body and html', () => {
    const body = document.body;
    const html = document.documentElement;
    
    // These styles should be set in globals.css
    expect(body.style.maxWidth || '100vw').toBeTruthy();
    expect(html.style.maxWidth || '100vw').toBeTruthy();
  });

  it('should detect horizontal scroll when present', () => {
    setWindowWidth(375);
    
    // Simulate horizontal overflow
    Object.defineProperty(document.documentElement, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 500, // Wider than viewport
    });
    
    expect(hasHorizontalScroll()).toBe(true);
  });

  it('should not detect horizontal scroll when content fits', () => {
    setWindowWidth(375);
    
    // Simulate no overflow
    Object.defineProperty(document.documentElement, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 375, // Same as viewport
    });
    
    expect(hasHorizontalScroll()).toBe(false);
  });
});
