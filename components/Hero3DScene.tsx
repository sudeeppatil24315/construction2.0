'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import BuildingModel from './BuildingModel';
import Scene3DLoader from './Scene3DLoader';
import { use3DLoadingProgress } from '@/hooks/use3DLoadingProgress';

export default function Hero3DScene() {
  const [isInteracting, setIsInteracting] = useState(false);
  const { loadingState, onLoad } = use3DLoadingProgress();
  const [sceneReady, setSceneReady] = useState(false);

  const handleSceneReady = () => {
    setSceneReady(true);
    onLoad();
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Loading Overlay */}
      {loadingState.isLoading && !sceneReady && (
        <Scene3DLoader progress={loadingState.progress} />
      )}

      {/* Interaction Hint */}
      {!isInteracting && sceneReady && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-gold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm animate-pulse">
          Drag to rotate • Scroll to build
        </div>
      )}

      <Canvas
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Device pixel ratio for retina displays
        onCreated={() => {
          // Scene is created, start showing content
          setTimeout(handleSceneReady, 500);
        }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />

        {/* Lighting Setup - Three-point lighting */}
        {/* Key Light (main light with gold tint) */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          color="#E5C158"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Fill Light (softer, from opposite side) */}
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />

        {/* Rim Light (backlight for depth) */}
        <directionalLight position={[0, 5, -10]} intensity={0.8} color="#D4AF37" />

        {/* Ambient Light (overall scene illumination) */}
        <ambientLight intensity={0.3} />

        {/* Hemisphere Light (sky and ground) */}
        <hemisphereLight args={['#ffffff', '#1a1a1a', 0.5]} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* 3D Building Model */}
        <Suspense fallback={null}>
          <BuildingModel />
        </Suspense>

        {/* Controls - Allow user to rotate the scene */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          onStart={() => setIsInteracting(true)}
          onEnd={() => {
            // Resume auto-rotation after 2 seconds of inactivity
            setTimeout(() => setIsInteracting(false), 2000);
          }}
        />
      </Canvas>
    </div>
  );
}
