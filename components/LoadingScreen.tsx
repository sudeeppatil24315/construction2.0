'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress?: number;
  onComplete?: () => void;
}

export default function LoadingScreen({ progress = 0, onComplete }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= progress) {
          clearInterval(interval);
          return progress;
        }
        return Math.min(prev + 1, progress);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (displayProgress >= 100) {
      setIsExiting(true);
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [displayProgress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-800 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,#D4AF37_25%,#D4AF37_50%,transparent_50%,transparent_75%,#D4AF37_75%,#D4AF37)] bg-[length:60px_60px] animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-gold">SB</span> <span className="text-white">Infra</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Projects</p>
        </div>

        {/* Animated building icon */}
        <div className="relative w-32 h-32">
          {/* Foundation */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-gold transition-all duration-500"
            style={{
              opacity: displayProgress > 0 ? 1 : 0,
              transform: `translateX(-50%) scaleX(${Math.min(displayProgress / 33, 1)})`,
            }}
          />

          {/* Walls */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-16 border-2 border-gold transition-all duration-500"
            style={{
              opacity: displayProgress > 33 ? 1 : 0,
              transform: `translateX(-50%) scaleY(${Math.min((displayProgress - 33) / 33, 1)})`,
              transformOrigin: 'bottom',
            }}
          />

          {/* Roof */}
          <div
            className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 w-0 h-0 transition-all duration-500"
            style={{
              opacity: displayProgress > 66 ? 1 : 0,
              borderLeft: '48px solid transparent',
              borderRight: '48px solid transparent',
              borderBottom: `32px solid #D4AF37`,
              transform: `translateX(-50%) scale(${Math.min((displayProgress - 66) / 34, 1)})`,
              transformOrigin: 'bottom',
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-gold text-2xl font-bold">{displayProgress}%</span>
            <p className="text-gray-500 text-xs mt-1">Building Excellence</p>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gold animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
