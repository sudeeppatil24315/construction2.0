'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import BuildingModel from './BuildingModel';
import ParticleSystem from './ParticleSystem';
import Scene3DLoader from './Scene3DLoader';
import { use3DLoadingProgress } from '@/hooks/use3DLoadingProgress';
import { detectDeviceCapabilities, getLODSettings, getOptimalDPR } from '@/lib/device-detector';

interface Hero3DSceneProps {
  quality?: '2d-fallback' | '3d-low' | '3d-medium' | '3d-high';
}

export default function Hero3DScene({ quality }: Hero3DSceneProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const { loadingState, onLoad } = use3DLoadingProgress();
  const [sceneReady, setSceneReady] = useState(false);

  // Detect device capabilities - memoize to prevent recalculation
  const deviceCaps = useMemo(() => detectDeviceCapabilities(), []);
  const effectiveQuality = quality || deviceCaps.recommendedQuality;
  const lodSettings = useMemo(
    () => getLODSettings(effectiveQuality, deviceCaps.devicePixelRatio),
    [effectiveQuality, deviceCaps.devicePixelRatio]
  );
  const optimalDPR = useMemo(() => getOptimalDPR(), []);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    onLoad();
  }, [onLoad]);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    // Resume auto-rotation after 2 seconds of inactivity (if not mobile)
    if (!deviceCaps.isMobile) {
      setTimeout(() => setIsInteracting(false), 2000);
    }
  }, [deviceCaps.isMobile]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black via-gray-900 to-black">
      {/* 3D Loading Overlay */}
      {loadingState.isLoading && !sceneReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Scene3DLoader progress={loadingState.progress} />
        </div>
      )}

      {/* Interaction Hint */}
      {!isInteracting && sceneReady && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-gold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm animate-pulse">
          Drag to rotate • Scroll to build
        </div>
      )}

      <div className="w-full h-full">
        <Canvas
          key="hero-canvas-stable"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          gl={{
            antialias: lodSettings.antialias,
            alpha: true,
            powerPreference: deviceCaps.isMobile ? 'low-power' : 'high-performance',
            preserveDrawingBuffer: false,
            stencil: false,
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={optimalDPR}
          shadows={lodSettings.shadowQuality !== 'none'}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 1);
            setTimeout(handleSceneReady, 500);
          }}
        >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />

        {/* Lighting Setup - Three-point lighting (adjusted for quality) */}
        {/* Key Light (main light with gold tint) */}
        {lodSettings.maxLights >= 1 && (
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            color="#E5C158"
            castShadow={lodSettings.shadowQuality === 'high' || lodSettings.shadowQuality === 'medium'}
            shadow-mapSize-width={lodSettings.shadowQuality === 'high' ? 2048 : 1024}
            shadow-mapSize-height={lodSettings.shadowQuality === 'high' ? 2048 : 1024}
          />
        )}

        {/* Fill Light (softer, from opposite side) */}
        {lodSettings.maxLights >= 2 && (
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
        )}

        {/* Rim Light (backlight for depth) - only on higher quality */}
        {lodSettings.maxLights >= 3 && (
          <directionalLight position={[0, 5, -10]} intensity={0.8} color="#D4AF37" />
        )}

        {/* Ambient Light (overall scene illumination) */}
        <ambientLight intensity={lodSettings.maxLights >= 2 ? 0.3 : 0.5} />

        {/* Hemisphere Light (sky and ground) - only on medium+ quality */}
        {lodSettings.maxLights >= 3 && (
          <hemisphereLight args={['#ffffff', '#1a1a1a', 0.5]} />
        )}

        {/* Environment for reflections - only on high quality */}
        {lodSettings.enableReflections && <Environment preset="city" />}

        {/* 3D Building Model */}
        <Suspense fallback={null}>
          <BuildingModel quality={effectiveQuality} />
        </Suspense>

        {/* Particle System - adaptive count based on device */}
        {lodSettings.particleCount > 0 && (
          <ParticleSystem 
            count={lodSettings.particleCount} 
            spread={15} 
            speed={deviceCaps.isMobile ? 0.2 : 0.3} 
            opacity={deviceCaps.isMobile ? 0.3 : 0.5} 
          />
        )}

        {/* Controls - Allow user to rotate the scene */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!deviceCaps.isMobile && !isInteracting} // Disable auto-rotate on mobile to save battery
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          onStart={handleInteractionStart}
          onEnd={handleInteractionEnd}
        />
      </Canvas>
      </div>
    </div>
  );
}
