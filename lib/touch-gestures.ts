/**
 * Touch Gesture Detection and Handling
 * 
 * Provides utilities for detecting and handling native mobile gestures
 * including swipe, pinch, and tap interactions.
 * 
 * Requirements: 8.5, 27.2, 27.5
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchEvent {
  scale: number;
  center: { x: number; y: number };
}

export interface TapEvent {
  x: number;
  y: number;
  tapCount: number;
}

/**
 * Detect if device supports touch events
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Calculate distance between two touch points
 */
function getDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle of swipe in degrees
 */
function getSwipeAngle(startX: number, startY: number, endX: number, endY: number): number {
  const dx = endX - startX;
  const dy = endY - startY;
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

/**
 * Determine swipe direction from angle
 */
function getSwipeDirection(angle: number): 'left' | 'right' | 'up' | 'down' {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Right: -45 to 45 degrees
  if (normalizedAngle >= 315 || normalizedAngle < 45) return 'right';
  // Down: 45 to 135 degrees
  if (normalizedAngle >= 45 && normalizedAngle < 135) return 'down';
  // Left: 135 to 225 degrees
  if (normalizedAngle >= 135 && normalizedAngle < 225) return 'left';
  // Up: 225 to 315 degrees
  return 'up';
}

/**
 * Swipe gesture detector
 */
export class SwipeDetector {
  private startTouch: TouchPoint | null = null;
  private minSwipeDistance: number;
  private maxSwipeTime: number;
  
  constructor(minDistance = 50, maxTime = 300) {
    this.minSwipeDistance = minDistance;
    this.maxSwipeTime = maxTime;
  }
  
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this.startTouch = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }
  
  onTouchEnd(event: TouchEvent, callback: (swipe: SwipeEvent) => void): void {
    if (!this.startTouch || event.changedTouches.length !== 1) return;
    
    const touch = event.changedTouches[0];
    const endTouch: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    
    const dx = endTouch.x - this.startTouch.x;
    const dy = endTouch.y - this.startTouch.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = endTouch.timestamp - this.startTouch.timestamp;
    
    // Check if swipe meets minimum distance and maximum time requirements
    if (distance >= this.minSwipeDistance && duration <= this.maxSwipeTime) {
      const angle = getSwipeAngle(this.startTouch.x, this.startTouch.y, endTouch.x, endTouch.y);
      const direction = getSwipeDirection(angle);
      const velocity = distance / duration; // pixels per millisecond
      
      callback({
        direction,
        distance,
        velocity,
        duration,
      });
    }
    
    this.startTouch = null;
  }
}

/**
 * Pinch gesture detector for zoom functionality
 */
export class PinchDetector {
  private initialDistance: number | null = null;
  private initialScale = 1;
  
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 2) return;
    
    this.initialDistance = getDistance(event.touches[0], event.touches[1]);
  }
  
  onTouchMove(event: TouchEvent, callback: (pinch: PinchEvent) => void): void {
    if (event.touches.length !== 2 || this.initialDistance === null) return;
    
    const currentDistance = getDistance(event.touches[0], event.touches[1]);
    const scale = currentDistance / this.initialDistance;
    
    // Calculate center point between two touches
    const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    
    callback({
      scale: scale * this.initialScale,
      center: { x: centerX, y: centerY },
    });
  }
  
  onTouchEnd(): void {
    this.initialDistance = null;
  }
  
  setScale(scale: number): void {
    this.initialScale = scale;
  }
}

/**
 * Tap gesture detector (including double-tap)
 */
export class TapDetector {
  private lastTap: TouchPoint | null = null;
  private tapCount = 0;
  private tapTimeout: NodeJS.Timeout | null = null;
  private doubleTapDelay: number;
  private maxTapDistance: number;
  
  constructor(doubleTapDelay = 300, maxTapDistance = 10) {
    this.doubleTapDelay = doubleTapDelay;
    this.maxTapDistance = maxTapDistance;
  }
  
  onTouchEnd(event: TouchEvent, callback: (tap: TapEvent) => void): void {
    if (event.changedTouches.length !== 1) return;
    
    const touch = event.changedTouches[0];
    const currentTap: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    
    // Check if this is a double tap
    if (this.lastTap) {
      const dx = currentTap.x - this.lastTap.x;
      const dy = currentTap.y - this.lastTap.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDiff = currentTap.timestamp - this.lastTap.timestamp;
      
      if (distance <= this.maxTapDistance && timeDiff <= this.doubleTapDelay) {
        this.tapCount++;
      } else {
        this.tapCount = 1;
      }
    } else {
      this.tapCount = 1;
    }
    
    this.lastTap = currentTap;
    
    // Clear existing timeout
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }
    
    // Set timeout to trigger callback
    this.tapTimeout = setTimeout(() => {
      callback({
        x: currentTap.x,
        y: currentTap.y,
        tapCount: this.tapCount,
      });
      this.tapCount = 0;
      this.lastTap = null;
    }, this.doubleTapDelay);
  }
  
  cleanup(): void {
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = null;
    }
  }
}

/**
 * React hook for swipe gesture detection
 */
export function useSwipeGesture(
  onSwipe: (swipe: SwipeEvent) => void,
  options?: { minDistance?: number; maxTime?: number }
) {
  const detector = new SwipeDetector(options?.minDistance, options?.maxTime);
  
  const handlers = {
    onTouchStart: (e: TouchEvent) => detector.onTouchStart(e),
    onTouchEnd: (e: TouchEvent) => detector.onTouchEnd(e, onSwipe),
  };
  
  return handlers;
}

/**
 * React hook for pinch gesture detection
 */
export function usePinchGesture(onPinch: (pinch: PinchEvent) => void) {
  const detector = new PinchDetector();
  
  const handlers = {
    onTouchStart: (e: TouchEvent) => detector.onTouchStart(e),
    onTouchMove: (e: TouchEvent) => detector.onTouchMove(e, onPinch),
    onTouchEnd: () => detector.onTouchEnd(),
  };
  
  return handlers;
}

/**
 * React hook for tap gesture detection
 */
export function useTapGesture(
  onTap: (tap: TapEvent) => void,
  options?: { doubleTapDelay?: number; maxTapDistance?: number }
) {
  const detector = new TapDetector(options?.doubleTapDelay, options?.maxTapDistance);
  
  const handlers = {
    onTouchEnd: (e: TouchEvent) => detector.onTouchEnd(e, onTap),
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => detector.cleanup();
  }, []);
  
  return handlers;
}

// Import React for hooks
import React from 'react';

/**
 * Verify touch target meets minimum size requirements (44x44px)
 */
export function verifyTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // pixels
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Get all interactive elements that don't meet touch target requirements
 */
export function getInvalidTouchTargets(): HTMLElement[] {
  const interactiveSelectors = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[onclick]',
  ];
  
  const elements = document.querySelectorAll<HTMLElement>(interactiveSelectors.join(','));
  const invalidElements: HTMLElement[] = [];
  
  elements.forEach((element) => {
    // Skip inline text links
    if (element.tagName === 'A' && !element.className.includes('button') && !element.className.includes('btn')) {
      return;
    }
    
    if (!verifyTouchTargetSize(element)) {
      invalidElements.push(element);
    }
  });
  
  return invalidElements;
}

/**
 * Prevent default touch behaviors that might interfere with gestures
 */
export function preventDefaultTouchBehaviors(element: HTMLElement): void {
  // Prevent double-tap zoom
  element.style.touchAction = 'manipulation';
  
  // Prevent text selection on touch
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';
  
  // Prevent tap highlight
  (element.style as any).webkitTapHighlightColor = 'transparent';
}

/**
 * Enable smooth scrolling with momentum on iOS
 */
export function enableMomentumScrolling(element: HTMLElement): void {
  (element.style as any).webkitOverflowScrolling = 'touch';
  element.style.overflowY = 'auto';
}
