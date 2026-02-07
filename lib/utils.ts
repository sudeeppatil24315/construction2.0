import { type ClassValue, clsx } from 'clsx';

// Utility for merging class names (will install clsx if needed)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Detect WebGL support
export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl')
    );
  } catch (e) {
    return false;
  }
}

// Smooth scroll to element
export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get device quality level based on viewport
export function getDeviceQuality(): '3d-low' | '3d-medium' | '3d-high' {
  if (typeof window === 'undefined') return '3d-medium';
  
  const width = window.innerWidth;
  if (width < 768) return '3d-low';
  if (width < 1024) return '3d-medium';
  return '3d-high';
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}
