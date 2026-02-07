/**
 * Device Detection and Performance Tier Utilities
 * 
 * Detects device capabilities and determines appropriate 3D quality settings
 * for optimal performance on mobile, tablet, and desktop devices.
 * 
 * Validates: Requirements 8.4, 21.8, 21.9
 */

import { getCurrentBreakpoint, isMobile, isTablet } from './breakpoints';
import { getWebGLCapabilities } from './webgl-detector';

export type DevicePerformanceTier = 'low' | 'medium' | 'high';
export type Quality3DLevel = '2d-fallback' | '3d-low' | '3d-medium' | '3d-high';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasWebGL: boolean;
  webGLTier: 'none' | 'low' | 'medium' | 'high';
  performanceTier: DevicePerformanceTier;
  recommendedQuality: Quality3DLevel;
  maxTextureSize: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
  memory?: number; // GB, if available
  isTouchDevice: boolean;
  isLowPowerMode: boolean;
}

/**
 * Detect if device is in low power mode (battery saver)
 * This is a heuristic based on available APIs
 */
function detectLowPowerMode(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check battery API if available
  if ('getBattery' in navigator) {
    // Battery API is async, so we can't use it synchronously
    // Return false for now, could be enhanced with async detection
    return false;
  }

  // Check for reduced motion preference as a proxy
  if (window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return true;
  }

  return false;
}

/**
 * Detect device memory in GB (if available)
 */
function getDeviceMemory(): number | undefined {
  if (typeof navigator === 'undefined') return undefined;

  // @ts-ignore - deviceMemory is not in TypeScript types yet
  if ('deviceMemory' in navigator) {
    // @ts-ignore
    return navigator.deviceMemory as number;
  }

  return undefined;
}

/**
 * Determine performance tier based on device characteristics
 */
function determinePerformanceTier(
  webGLTier: 'none' | 'low' | 'medium' | 'high',
  breakpoint: string,
  memory?: number,
  hardwareConcurrency?: number
): DevicePerformanceTier {
  // No WebGL support = low tier
  if (webGLTier === 'none' || webGLTier === 'low') {
    return 'low';
  }

  // Mobile devices default to low tier for battery life
  if (breakpoint === 'mobile') {
    // High-end mobile devices with good specs can be medium
    if (webGLTier === 'high' && memory && memory >= 4 && hardwareConcurrency && hardwareConcurrency >= 6) {
      return 'medium';
    }
    return 'low';
  }

  // Tablet devices
  if (breakpoint === 'tablet') {
    if (webGLTier === 'high' && memory && memory >= 4) {
      return 'high';
    }
    return 'medium';
  }

  // Desktop devices
  if (webGLTier === 'high' && memory && memory >= 8) {
    return 'high';
  }

  if (webGLTier === 'medium' || (webGLTier === 'high' && (!memory || memory < 8))) {
    return 'medium';
  }

  return 'low';
}

/**
 * Get recommended 3D quality level based on device capabilities
 */
function getRecommendedQuality(
  performanceTier: DevicePerformanceTier,
  hasWebGL: boolean,
  isLowPowerMode: boolean
): Quality3DLevel {
  // No WebGL = 2D fallback
  if (!hasWebGL) {
    return '2d-fallback';
  }

  // Low power mode = reduce quality
  if (isLowPowerMode) {
    if (performanceTier === 'high') return '3d-medium';
    if (performanceTier === 'medium') return '3d-low';
    return '2d-fallback';
  }

  // Map performance tier to quality level
  switch (performanceTier) {
    case 'high':
      return '3d-high';
    case 'medium':
      return '3d-medium';
    case 'low':
      return '3d-low';
    default:
      return '3d-low';
  }
}

/**
 * Detect comprehensive device capabilities
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const breakpoint = getCurrentBreakpoint();
  const webGLCaps = getWebGLCapabilities();
  const memory = getDeviceMemory();
  const hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2;
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  const isLowPowerMode = detectLowPowerMode();

  const performanceTier = determinePerformanceTier(
    webGLCaps.tier,
    breakpoint,
    memory,
    hardwareConcurrency
  );

  const recommendedQuality = getRecommendedQuality(
    performanceTier,
    webGLCaps.supported,
    isLowPowerMode
  );

  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    hasWebGL: webGLCaps.supported,
    webGLTier: webGLCaps.tier,
    performanceTier,
    recommendedQuality,
    maxTextureSize: webGLCaps.maxTextureSize,
    devicePixelRatio,
    hardwareConcurrency,
    memory,
    isTouchDevice,
    isLowPowerMode,
  };
}

/**
 * Get LOD (Level of Detail) settings based on quality level
 */
export interface LODSettings {
  geometryDetail: 'low' | 'medium' | 'high';
  textureResolution: 256 | 512 | 1024 | 2048;
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  particleCount: number;
  enableReflections: boolean;
  enableAmbientOcclusion: boolean;
  enablePostProcessing: boolean;
  maxLights: number;
  antialias: boolean;
  pixelRatio: number;
}

export function getLODSettings(quality: Quality3DLevel, devicePixelRatio: number = 1): LODSettings {
  switch (quality) {
    case '3d-high':
      return {
        geometryDetail: 'high',
        textureResolution: 2048,
        shadowQuality: 'high',
        particleCount: 150,
        enableReflections: true,
        enableAmbientOcclusion: true,
        enablePostProcessing: true,
        maxLights: 5,
        antialias: true,
        pixelRatio: Math.min(devicePixelRatio, 2),
      };

    case '3d-medium':
      return {
        geometryDetail: 'medium',
        textureResolution: 1024,
        shadowQuality: 'medium',
        particleCount: 75,
        enableReflections: true,
        enableAmbientOcclusion: false,
        enablePostProcessing: false,
        maxLights: 3,
        antialias: true,
        pixelRatio: Math.min(devicePixelRatio, 1.5),
      };

    case '3d-low':
      return {
        geometryDetail: 'low',
        textureResolution: 512,
        shadowQuality: 'low',
        particleCount: 30,
        enableReflections: false,
        enableAmbientOcclusion: false,
        enablePostProcessing: false,
        maxLights: 2,
        antialias: false,
        pixelRatio: 1,
      };

    case '2d-fallback':
    default:
      return {
        geometryDetail: 'low',
        textureResolution: 256,
        shadowQuality: 'none',
        particleCount: 0,
        enableReflections: false,
        enableAmbientOcclusion: false,
        enablePostProcessing: false,
        maxLights: 1,
        antialias: false,
        pixelRatio: 1,
      };
  }
}

/**
 * Get geometry segment counts based on detail level
 */
export function getGeometrySegments(detail: 'low' | 'medium' | 'high'): {
  box: [number, number, number];
  sphere: [number, number];
  cylinder: [number, number];
  cone: number;
} {
  switch (detail) {
    case 'high':
      return {
        box: [32, 32, 32],
        sphere: [32, 32],
        cylinder: [32, 32],
        cone: 32,
      };
    case 'medium':
      return {
        box: [16, 16, 16],
        sphere: [16, 16],
        cylinder: [16, 16],
        cone: 16,
      };
    case 'low':
    default:
      return {
        box: [8, 8, 8],
        sphere: [8, 8],
        cylinder: [8, 8],
        cone: 8,
      };
  }
}

/**
 * Check if device should use simplified 3D
 */
export function shouldUseSimplified3D(): boolean {
  const caps = detectDeviceCapabilities();
  return caps.performanceTier === 'low' || caps.isMobile || !caps.hasWebGL;
}

/**
 * Check if device should disable 3D entirely
 */
export function shouldDisable3D(): boolean {
  const caps = detectDeviceCapabilities();
  return !caps.hasWebGL || caps.webGLTier === 'none';
}

/**
 * Get optimal canvas DPR (device pixel ratio) for performance
 */
export function getOptimalDPR(): [number, number] {
  const caps = detectDeviceCapabilities();
  const settings = getLODSettings(caps.recommendedQuality, caps.devicePixelRatio);
  
  // Return [min, max] DPR
  return [1, settings.pixelRatio];
}

/**
 * Monitor performance and suggest quality adjustments
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private fpsHistory: number[] = [];
  private readonly historySize = 60; // 1 second at 60fps
  private readonly targetFPS = 30; // Minimum acceptable FPS
  private qualityLevel: Quality3DLevel;

  constructor(initialQuality: Quality3DLevel) {
    this.qualityLevel = initialQuality;
    this.lastTime = performance.now();
  }

  /**
   * Update FPS measurement
   * Call this every frame
   */
  update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    if (delta > 0) {
      this.fps = 1000 / delta;
      this.fpsHistory.push(this.fps);
      
      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift();
      }
    }
    
    this.lastTime = now;
    this.frameCount++;
  }

  /**
   * Get average FPS over the history window
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }

  /**
   * Check if performance is poor and quality should be reduced
   */
  shouldReduceQuality(): boolean {
    if (this.fpsHistory.length < this.historySize / 2) {
      return false; // Not enough data yet
    }

    const avgFPS = this.getAverageFPS();
    return avgFPS < this.targetFPS;
  }

  /**
   * Get suggested quality level based on performance
   */
  getSuggestedQuality(): Quality3DLevel {
    if (!this.shouldReduceQuality()) {
      return this.qualityLevel;
    }

    // Reduce quality one level
    switch (this.qualityLevel) {
      case '3d-high':
        return '3d-medium';
      case '3d-medium':
        return '3d-low';
      case '3d-low':
        return '2d-fallback';
      default:
        return this.qualityLevel;
    }
  }

  /**
   * Reset the monitor
   */
  reset(): void {
    this.frameCount = 0;
    this.fpsHistory = [];
    this.lastTime = performance.now();
  }
}
