'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class Scene3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <Scene3DFallback />;
    }

    return this.props.children;
  }
}

// 2D Fallback component when 3D fails
function Scene3DFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,#D4AF37_25%,#D4AF37_50%,transparent_50%,transparent_75%,#D4AF37_75%,#D4AF37)] bg-[length:60px_60px] animate-pulse"></div>
      </div>

      {/* 2D Building Illustration */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Simple 2D building SVG */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Foundation */}
          <rect
            x="50"
            y="160"
            width="100"
            height="10"
            fill="#D4AF37"
            opacity="0.8"
          />

          {/* Building body */}
          <rect
            x="60"
            y="100"
            width="80"
            height="60"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Windows */}
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={75 + col * 30}
                y={110 + row * 15}
                width="10"
                height="10"
                fill="#D4AF37"
                opacity="0.6"
              />
            ))
          )}

          {/* Roof */}
          <polygon
            points="100,70 50,100 150,100"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Roof lines */}
          <line
            x1="100"
            y1="70"
            x2="100"
            y2="100"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>

        {/* Message */}
        <div className="text-center">
          <p className="text-gold text-lg font-semibold mb-2">
            Building Excellence
          </p>
          <p className="text-gray-400 text-sm max-w-xs">
            3D visualization unavailable. Your browser may not support WebGL.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Scene3DErrorBoundary;
