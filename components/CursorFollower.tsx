'use client';

import { useEffect, useRef, useState } from 'react';

interface CursorFollowerProps {
  variant?: 'spotlight' | 'trail' | 'glow';
  color?: string;
  size?: number;
  intensity?: number;
}

export default function CursorFollower({
  variant = 'spotlight',
  color = '#D4AF37',
  size = 300,
  intensity = 0.3,
}: CursorFollowerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Don't render on mobile for performance
    if (isMobile) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  if (variant === 'spotlight') {
    return (
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? intensity : 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full blur-3xl"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div
        className="fixed pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? intensity : 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full blur-2xl animate-pulse"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, ${color}60 0%, ${color}20 50%, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  // Trail variant
  return (
    <div
      ref={trailRef}
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? intensity : 0,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s ease-out, top 0.1s ease-out, opacity 0.3s',
      }}
    >
      <div
        className="rounded-full blur-xl"
        style={{
          width: `${size / 2}px`,
          height: `${size / 2}px`,
          background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
