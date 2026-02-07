'use client';

interface GeometricPatternProps {
  variant?: 'hexagon' | 'triangle' | 'diamond' | 'grid' | 'circles';
  opacity?: number;
  color?: string;
  className?: string;
}

export default function GeometricPattern({
  variant = 'hexagon',
  opacity = 0.1,
  color = '#D4AF37',
  className = '',
}: GeometricPatternProps) {
  const patterns = {
    hexagon: (
      <svg className={`w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern
            id="hexagon-pattern"
            x="0"
            y="0"
            width="100"
            height="87"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25 0 L75 0 L100 43.5 L75 87 L25 87 L0 43.5 Z"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
      </svg>
    ),

    triangle: (
      <svg className={`w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern
            id="triangle-pattern"
            x="0"
            y="0"
            width="80"
            height="70"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0 L80 70 L0 70 Z" fill="none" stroke={color} strokeWidth="1" />
            <path d="M40 70 L0 0 L80 0 Z" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#triangle-pattern)" />
      </svg>
    ),

    diamond: (
      <svg className={`w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern
            id="diamond-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
      </svg>
    ),

    grid: (
      <svg className={`w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    ),

    circles: (
      <svg className={`w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern
            id="circles-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="20" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="30" cy="30" r="10" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circles-pattern)" />
      </svg>
    ),
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {patterns[variant]}
    </div>
  );
}
