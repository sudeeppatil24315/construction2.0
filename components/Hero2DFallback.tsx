'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * 2D Fallback for Hero Section
 * 
 * Provides a visually appealing 2D alternative when 3D is not supported
 * or when device performance is too low for 3D rendering.
 * 
 * Features:
 * - Parallax scrolling effect
 * - Animated building illustration
 * - Gold particle effects (CSS-based)
 * - Responsive design
 * 
 * Validates: Requirements 8.4, 16.4, 25.2
 */
export default function Hero2DFallback() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const buildingY = useTransform(scrollY, [0, 500], [0, 150]);
  const particlesY = useTransform(scrollY, [0, 500], [0, -100]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0, 0.5]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated particles background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: particlesY }}
      >
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Building illustration */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: buildingY }}
      >
        <BuildingIllustration />
      </motion.div>

      {/* Scroll overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Interaction hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-gold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          Scroll to explore
        </motion.div>
      </div>

      <style jsx>{`
        .particles-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #D4AF37;
          border-radius: 50%;
          opacity: 0.6;
          animation: float linear infinite;
          box-shadow: 0 0 10px #D4AF37;
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * SVG Building Illustration
 * Simple, stylized building that animates on scroll
 */
function BuildingIllustration() {
  const { scrollY } = useScroll();
  const constructionProgress = useTransform(scrollY, [0, 500], [0, 1]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = constructionProgress.on('change', (v) => setProgress(v));
    return () => unsubscribe();
  }, [constructionProgress]);

  return (
    <svg
      width="300"
      height="400"
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-2xl"
    >
      {/* Foundation */}
      <motion.rect
        x="50"
        y="350"
        width="200"
        height="40"
        fill="#666666"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: Math.min(progress / 0.3, 1) }}
        transition={{ duration: 0.3 }}
      />

      {/* Main building structure */}
      <motion.rect
        x="70"
        y="200"
        width="160"
        height="150"
        fill="#8B8B8B"
        stroke="#D4AF37"
        strokeWidth="2"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: Math.max(0, Math.min((progress - 0.3) / 0.4, 1)) }}
        transition={{ duration: 0.4 }}
      />

      {/* Windows */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <motion.rect
            key={`window-${row}-${col}`}
            x={90 + col * 40}
            y={220 + row * 40}
            width="25"
            height="30"
            fill="#87CEEB"
            opacity={0.6}
            initial={{ opacity: 0 }}
            animate={{
              opacity: Math.max(0, Math.min((progress - 0.3) / 0.4, 1)) * 0.6,
            }}
            transition={{ delay: (row * 3 + col) * 0.05 }}
          />
        ))
      )}

      {/* Gold accent beams */}
      {[70, 150, 230].map((x, i) => (
        <motion.rect
          key={`beam-${i}`}
          x={x}
          y="200"
          width="4"
          height="150"
          fill="#D4AF37"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: Math.max(0, Math.min((progress - 0.3) / 0.4, 1)) }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        />
      ))}

      {/* Roof */}
      <motion.polygon
        points="150,150 70,200 230,200"
        fill="#D4AF37"
        stroke="#B8941F"
        strokeWidth="2"
        initial={{ scale: 0, originX: 0.5, originY: 1 }}
        animate={{ scale: Math.max(0, Math.min((progress - 0.7) / 0.3, 1)) }}
        transition={{ duration: 0.3 }}
      />

      {/* Roof details */}
      <motion.line
        x1="150"
        y1="150"
        x2="150"
        y2="200"
        stroke="#B8941F"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(0, Math.min((progress - 0.7) / 0.3, 1)) }}
      />

      {/* Ground line */}
      <line x1="0" y1="390" x2="300" y2="390" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
